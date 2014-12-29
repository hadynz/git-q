var Q = require('q'),
  shell = require('shelljs');

var keys = {
  GIT_NAME: 'GIT_NAME',
  GIT_EMAIL: 'GIT_EMAIL',
  GIT_TOKEN: 'GH_TOKEN'
};

/**
 * Initialise the Q-Git interface class
 *
 * @constructor
 * @class QGit
 */
var QGit = function () {
  // ...
};

QGit.prototype = {

  setUserInfo: function () {
    var me = this,
      name = shell.env[keys.GIT_NAME],
      email = shell.env[keys.GIT_EMAIL];

    return Q.all([
      me._run('git config --global user.name "' + name + '"'),
      me._run('git config --global user.email "' + email + '"')
    ]);
  },

  writeGitCredentials: function () {
    var me = this,
      token = shell.env[keys.GIT_TOKEN];

    return new Q()
      .then(function () {
        return me._run('git config credential.helper "store --file=.git/credentials"');
      })
      .then(function () {
        return me._run('echo "https://' + token + ':@github.com" > .git/credentials');
      });
  },

  setRemoteUrl: function (url) {
    return this._run('git remote set-url origin ' + url);
  },

  fetchTags: function () {
    return this._run('git fetch --tags');
  },

  tag: function (tagName, message) {
    return this._run('git tag ' + tagName + ' -m "' + message + '"');
  },

  pushTags: function () {
    return this._run('git push --tags');
  },

  _run: function (cmd, silent) {
    var deferred = Q.defer();

    silent = typeof silent !== 'undefined' ? silent : true;

    shell.exec(cmd, { silent: silent }, function (code, output) {
      if (code === 0) {
        console.log('->', cmd);

        if (output) {
          console.log('#', output);
        }

        deferred.resolve(output.trim());
      }
      else {
        deferred.reject('Error: cmd: `' + cmd + '`\n       stderr: ' + output);
      }
    });

    return deferred.promise;
  }

};

// export the Q-Git module
module.exports = QGit;
