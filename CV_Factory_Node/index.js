require('./config/config');

const fs = require('fs');
const {google} = require('googleapis');
const async = require('async');
const express = require('express');
const key = require('./auth.json');

const app = express();
const port = process.env.PORT || 3000;
const permissionEmail = process.env.PERMISSION_ADDRESS || '';

const SCOPES = ['https://www.googleapis.com/auth/drive'];
const jwt = new google.auth.JWT(key.client_email, null, key.private_key, SCOPES);

const permissionsToAdd = [{
  'type': 'user',
  'role': 'writer',
  'emailAddress': permissionEmail
}];

// Auth with async function
// const auth = async (jwt) => {
//   const drive = await jwt.authorize((err, response) => {
//     console.log('auth');
//     return google.drive({version: 'v3', auth: jwt});
//   });
//   return drive;
// };

// POST /files -- File push to Google Drive
app.post('/files/:fileName', (req, res) => {
  const fileName = req.params.fileName;
  if (!fileName) {
    return res.status(400).send({
      error: 'File name is incorrect.'
    });
  }
  jwt.authorize(async (err, _) => {
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
    'name': fileName
  };

  try {
    const media = {
      // TODO: Useful to get mime type or always docx?
      mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.template',
      body: fs.createReadStream(`files/${fileName}`)
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
      fields: 'nextPageToken, files(id, name, modifiedTime, permissions)',
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
        console.log('Permission ID: ', res.data.id)
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