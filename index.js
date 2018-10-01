require('./config/config');

// IMPORTS
// NPM packages
const axios = require('axios');
const bodyParser = require('body-parser');
const express = require('express');
const fs = require('fs');
const { google } = require('googleapis');
const path = require('path');

// Auth & logs
const key = require('./auth/production-auth.json');
const winston = require('./config/winston');

// Custom functions
const { getFiles, postFiles } = require('./src/functions/drive-utils');
const { gitClone } = require('./src/functions/repo-clone');
const { readDirectory } = require('./src/functions/read-directory');

// Routing
const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Vars for Google authentication
const SCOPES = process.env.SCOPES;
const jwt = new google.auth.JWT(key.client_email, null, key.private_key, SCOPES);

// Local variables
const url = process.env.GIT_REPO_CV_URL;
const local = path.join(__dirname, 'resumes')


// POST /github/push -- Toggled on git push
app.post('/github/push', async (req, res) => {
  // const githubEvent = req.body

  try {
    if (!fs.existsSync(local)) {
      const repo = await gitClone(url, local);

      if (repo.status && repo.status === 400) {
        return repo.error;
      }
    }

    readDirectory(local);

  } catch (e) {
    winston.log('error', e);
  }
});

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
      winston.log('error', response.error.errors);
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
