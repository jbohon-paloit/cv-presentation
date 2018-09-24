const fs = require('fs');
const pandoc = require('node-pandoc');
const path = require('path');

const { createFolder } = require('./drive-utils');
const { pandocCallback } = require('./pandoc-callback');
const winston = require('../../config/winston');

const readDirectory = (local) => {
  fs.readdir(local, async (err, files) => {
    if (err)  {
      return err;
    }
    mdFiles = files.filter((file) => path.extname(file) === '.md');

    // Create timestamped Google Drive folder
    const folderId = await createFolder();
    winston.log('info', `folderId: ${folderId}`);

    mdFiles.forEach((file) => {
      // Run pandoc transformation
      const appRootDir = path.dirname(require.main.filename);
      const docxFile = `${path.basename(file, '.md')}.docx`;
      const pathToDocxFile = path.join(appRootDir, 'resumes', docxFile);
      const args = `-f markdown -o ${pathToDocxFile}`;

      winston.log('info', `Converting file ${file}...`);

      // Call pandoc
      pandoc(`./resumes/${file}`, args, async (err, result) => {
        // Call exported function
        await pandocCallback(err, result, file, folderId);
      });

      return true;
    });
  });
};

module.exports = {
  readDirectory
};