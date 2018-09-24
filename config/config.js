const config = require('./config.json');
const fs = require('fs');

Object.keys(config).forEach((key) => {
  process.env[key] = config[key];
});

// Decrypt auth file if it does not exist
const { decrypt } = require('../src/functions/decrypt-file');
if (!fs.existsSync('./production-auth.json')) {
  decrypt();
  console.log('Decrypted auth file');
}