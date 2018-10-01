// Drive Utils
// This file contains different methods used to handle Google files & folders
// createFolder -> Creates a folder in which we will upload the CVs
// updatePermission -> Updates permission on a file/folder to share it with user email (in config/config.json)
// postFiles -> Posts a file to Google Drive
// getFiles -> Gets a list of the most recent uploaded files

const async = require('async');
const fs = require('fs');
const { google } = require('googleapis');
const moment = require('moment');

const key = require('../../auth/production-auth.json');
const SCOPES = process.env.SCOPES;

const jwt = new google.auth.JWT(key.client_email, null, key.private_key, SCOPES);
const winston = require('../../config/winston');

const permissionEmail = process.env.PERMISSION_ADDRESS || '';
const permissionToAdd = [{
  'type': 'user',
  'role': 'writer',
  'emailAddress': permissionEmail
}];
// Permission to set if we want to share documents with group/domain
// TODO: Think about who we want to share it with
// const permissionToAdd = [{
//   'type': 'domain',
//   'role': 'writer',
//   'emailAddress': 'palo-it.com'
// }];

// Create Google Drive folder
const createFolder = async () => {
  return new Promise((resolve, reject) => {
    const repoDate = moment().format('DD-MM-YYYY HH:mm');
    winston.log('info', 'repoDate ' + repoDate);
    const fileMetadata = {
      'name': `Resumes ${repoDate}`,
      'mimeType': 'application/vnd.google-apps.folder'
    };

    jwt.authorize(async (err) => {
      const drive = google.drive({version: 'v3', auth: jwt});
      const driveResponse = await drive.files.create({
        resource: fileMetadata,
        fields: 'id'
      });

      // Updating permission(s) right after file push to Drive throws an error (500)
      // Waiting 5 secs bypasses it
      await setTimeout(async () => {
        try {
          await updatePermission(drive, driveResponse.data.id);
          resolve(driveResponse.data.id);
        } catch (e) {
          console.log('ee', e);
          reject(perm.error);
        }
      }, 5000);

    });
  });
}

// Using the NPM module 'async'.
// Add permission to email associated in config/config.json
// So account has access to file.
const updatePermission = async (drive, fileId) => {
  async.eachSeries(permissionToAdd, (permission, permissionCallback) => {
    drive.permissions.create({
      resource: permission,
      fileId: fileId,
      fields: 'id',
    }, function (err, res) {
      if (err) {
        // console.error(err);
        winston.log('error', 'Permission error: ' + err);
        permissionCallback(err);
      } else {
        // console.log('Permission added: ', res.data.id)
        winston.log('info', 'Permission added: ' + res.data.id + ' on file ' + fileId);
        permissionCallback();
      }
    });
  }, (err) => {
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

const postFiles = async (drive, fileName, folderId) => {
  const fileMetadata = {
    'name': fileName,
    'mimeType': 'application/vnd.google-apps.document',
    'parents': [folderId]
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

const getFiles = async (drive) => {
  try {
    const driveResponse = await drive.files.list({
      pageSize: 20,
      // fields: 'nextPageToken, files(id, name, modifiedTime, permissions, teamDriveId, owners, capabilities, shared, properties)',
      fields: 'nextPageToken, files(id, name, modifiedTime, teamDriveId, owners, parents)',
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


module.exports = {
  createFolder,
  postFiles,
  getFiles
};
