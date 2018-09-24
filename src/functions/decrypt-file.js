const NodeRSA = require('node-rsa');
const fs = require('fs');
const path = require('path');

const rootDir = path.dirname(require.main.filename);

const decrypt = () => {
  // Read in your private key from wherever you store it
  console.log(`dir => ${rootDir}/keys/cvfactory-privatekey.pem`);
  const file = fs.readFileSync('/keys/cvfactory-privatekey.pem', 'utf8');
  const key = new NodeRSA();
  key.importKey(file, 'pkcs1-pem');

  const encrypted = fs.readFileSync(`${rootDir}/encrypted/production-encrypted.js`, 'utf8');
  const decrypted = key.decrypt(encrypted, 'utf8');

  fs.openSync(path.join(rootDir, 'production-auth.json'), 'w');
  fs.writeFileSync(path.join(rootDir, 'production-auth.json'), decrypted, 'utf8');
};

module.exports = {
  decrypt
};