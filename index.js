require('./config/config');

const axios = require('axios');
const bodyParser = require('body-parser');
const express = require('express');
const fs = require('fs');
const { google } = require('googleapis');

const key = require('./auth.json');
const winston = require('./config/winston');

const { getFiles, postFiles } = require('./src/functions/drive-utils');
const { gitClone } = require('./src/functions/repo-clone');
const { readDirectory } = require('./src/functions/read-directory');

const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const SCOPES = process.env.SCOPES;
const jwt = new google.auth.JWT(key.client_email, null, key.private_key, SCOPES);

const path = require('path');
const url = process.env.GIT_REPO_CV_URL;
const local = path.join(__dirname, 'resumes')

async function main() {
  try {
    if (!fs.existsSync(local)) {
      const repo = await gitClone(url, local);

      if (repo.status && repo.status  === 400) {
        return repo.error;
      }
    }

    readDirectory(local);

  } catch (e) {
    winston.log('error', e);
  }

  axios.get('/files')
    .then(response => {
      winston.log('info', 'Response data %s', JSON.stringify(response.data, null, 1));
      // response.data.map((myFile) => deleteFile(myFile.id));
    }).catch(error => {
      winston.log('error', 'Error while getting files ' + error);
    });
}
main();

// POST /files -- File push to Google Drive
app.post('/files/:fileName', (req, res) => {
  const fileName = req.params.fileName;
  const folderId = req.body.folderId;

  if (!fileName) {
    return res.status(400).send({
      error: 'File name is incorrect.'
    });
  }
  jwt.authorize(async (err) => {
    if (err) {
      winston.log('error', err);
      return err;
    }
    const drive = google.drive({version: 'v3', auth: jwt});
    const response = await postFiles(drive, fileName, folderId);

    if (response.status === 400) {
      return res.status(400).send(response.error.errors);
    }
    res.send(response.data);
  });
});

// GET /files -- Get files stored in Google Drive 
app.get('/files', (req, res) => {
  jwt.authorize(async (err) => {
    if (err) {
      winston.log('error', err);
      return err;
    }
    const drive = google.drive({version: 'v3', auth: jwt});
    const response = await getFiles(drive);

    if (response.status === 400) {
      return res.status(400).send(response.error.errors);
    }
    res.send(response.data);
  });
}); 


app.listen(port, () => {
  winston.log('info', `Started up on port ${port}.`);
});

// For testing purpose only, method not used
const deleteFile = (fileId) => {
  const drive = google.drive({version: 'v3', auth: jwt});
  drive.files.delete({
    'fileId': fileId
  }, function (err, file) {
    if (err) {
      // Handle error
      winston.log('error', err);
    } else {
      winston.log('info', 'File deleted ');
    }
  });
};
