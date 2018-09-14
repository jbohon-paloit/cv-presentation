const Git = require('nodegit');
const winston = require('../../config/winston');

async function gitClone(url, local) {
  return Git.Clone(url, local).then((repo) => {
    return repo;
  }).catch(function (err) {
    winston.log('error', 'Error while cloning repo' + err);
    
    return {
      status: 400,
      error: err
    };
  })
}

module.exports = {
  gitClone
};