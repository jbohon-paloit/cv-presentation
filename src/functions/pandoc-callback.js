const axios = require('axios');
const fs = require('fs');
const path = require('path');
const winston = require('../../config/winston');

const pandocCallback = async (err , result, file, folderId) => {
  const appRootDir = path.dirname(require.main.filename);
  const docxFile = `${path.basename(file, '.md')}.docx`;
  const pathToDocxFile = path.join(appRootDir, 'resumes', docxFile);

  if (err) {
    winston.log('error', `Error while converting file ${file}`);
    winston.log('error', err);
    return result;
  }
  
  if (fs.existsSync(pathToDocxFile)) {
    winston.log('info', `${docxFile} created`);

    axios.post(`/files/${docxFile}`, {folderId})
      .then(response => {
        winston.log('info', `File ${docxFile} uploaded on Google Drive: ${response.data}`);
      }).catch(error => {
        winston.log('info', `Error during Google Drive upload ${error}`);
      });
  } else {
    console.log(`File ${docxFile} doesn't exist.`);
  }

  return result;
}

module.exports = {
  pandocCallback
};