require('./config/config');

const fs = require('fs');
const {google} = require('googleapis');
const async = require('async');
const axios = require('axios');
const express = require('express');
const Git = require('nodegit');
const pandoc = require('node-pandoc');

const key = require('./auth.json');

const app = express();
// const port = process.env.PORT || 3000;
const port = 80;

const SCOPES = ['https://www.googleapis.com/auth/drive'];
const jwt = new google.auth.JWT(key.client_email, null, key.private_key, SCOPES);

const permissionEmail = process.env.PERMISSION_ADDRESS || '';
const permissionsToAdd = [{
  'type': 'user',
  'role': 'writer',
  'emailAddress': permissionEmail
}];
// const permissionsToAdd = [{
//   'type': 'domain',
//   'role': 'writer',
//   'emailAddress': 'palo-it.com'
// }];

const path = require('path');
const url = "https://github.com/massardc/cv-fact.git";
const local = "./resumes";

async function gitClone() {
  return Git.Clone(url, local).then((repo) => {
    return repo;
  }).catch(function (err) {
    console.log('Error while cloning repo', err);
    
    return {
      status: 400,
      error: err
    };
  })
}

async function main() {
  try {
    const repo = await gitClone(url, local);
    if (repo.status && repo.status === 400) {
      console.log('repo', repo);
      return repo.error;
    }

    fs.readdir(repo.workdir(), async (err, files) => {
      if (err) {
        return err;
      }
      mdFiles = files.filter((file) => path.extname(file) === '.md');
      mdFiles.map(file => {
        // Run pandoc transformation
        const docxFile = `${path.basename(file, '.md')}.docx`;
        const args = `-f markdown -o ./resumes/${docxFile}`;
        let wentThrough = false;
        console.log('file', file);
        
        const pandocCallback = (err, result) => {
          if (!wentThrough) {
            wentThrough = true;

            if (err) {
              console.error('Error on parsing: ',err);
              return err;
            } 
            axios.post(`/files/${docxFile}`)
              .then(response => {
                console.log('File uploaded on Google Drive', response.data);
              }).catch(error => {
                console.log('Error during Google Drive upload', error);
              });
            return result;
          }
        }

        // Call pandoc
        pandoc(`./resumes/${file}`, args, pandocCallback);

        return true;
      });

    });
  } catch (e) {
    console.log('Error', e);
  }

    // axios.get('/files')
    // .then(response => {
    //   console.log('RRRR', response.data[0].permissions);
    //   console.log('RRR', response.data);
    // }).catch(error => {
    //   console.log(error);
    // });
}
main();


// POST /files -- File push to Google Drive
app.post('/files/:fileName', (req, res) => {
  const fileName = req.params.fileName;
  if (!fileName) {
    return res.status(400).send({
      error: 'File name is incorrect.'
    });
  }
  jwt.authorize(async (err) => {
    const drive = google.drive({version: 'v3', auth: jwt});
    const response = await postFiles(drive, fileName);

    if (response.status === 400) {
      return res.status(400).send(response.error.errors);
    }
    res.send(response.data);
  });
});

const postFiles = async (drive, fileName) => {
  const fileMetadata = {
    'name': fileName,
    'mimeType': 'application/vnd.google-apps.document'
  };

  try {
    const media = {
      // TODO: Useful to get mime type or always docx?
      mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.template',
      body: fs.createReadStream(`/cvfactory/resumes/${fileName}`)
    };

    const driveResponse = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id',
      writersCanShare: true
    });

    // Updating permission(s) right after file push to Drive throws an error (500)
    // Waiting 5 secs allows us to bypass that
    const perm = await setTimeout(() => {
      return updatePermission(drive, driveResponse.data.id);
    }, 5000); 

    if (perm.status === 400) {
      return {
        status: 400,
        error: perm.error
      };
    }
    return {
      status: 200,
      data: driveResponse.data.id
    };
  } catch (e) {
    return {
      status: 400,
      error: e
    };
  }
};

// GET /files -- Get files stored in Google Drive 
app.get('/files', (req, res) => {
  console.log('GET');
  jwt.authorize(async (err, _) => {
    const drive = google.drive({version: 'v3', auth: jwt});
    const response = await getFiles(drive);

    if (response.status === 400) {
      return res.status(400).send(response.error.errors);
    }
    res.send(response.data);
  });
}); 

const getFiles = async (drive) => {
  try {
    const driveResponse = await drive.files.list({
      pageSize: 20,
      fields: 'nextPageToken, files(id, name, modifiedTime, permissions, teamDriveId, owners, capabilities, shared, properties, isAppAuthorized)',
    });
    return {
      status: 200,
      data: driveResponse.data.files
    };
  } catch (e) {
    return {
      status: 400,
      error: e
    };
  }
};

// Using the NPM module 'async'.
// Add permission to email associated in config/config.json
// So account has access to file.
const updatePermission = (drive, fileId) => {
  async.eachSeries(permissionsToAdd, function (permission, permissionCallback) {
    drive.permissions.create({
      resource: permission,
      fileId: fileId,
      fields: 'id',
    }, function (err, res) {
      if (err) {
        console.error(err);
        permissionCallback(err);
      } else {
        console.log('Permission added: ', res.data.id)
        permissionCallback();
      }
    });
  }, function (err) {
    if (err) {
      return {
        status: 400,
        error: err
      };
    } else {
      return {
        status: 200
      };
    }
  });
};

app.get('/', (req, res) => {
  res.send('Hello world\n');
});


app.listen(port, () => {
  console.log(`Started up on port ${port}.`);
});

// For testing purpose only, method not used
const deleteFile = (drive, fileId) => {
  drive.files.delete({
    'fileId': fileId
  }, function (err, file) {
    if (err) {
      // Handle error
      console.error(err);
    } else {
      console.log('File deleted ');
    }
  });
};