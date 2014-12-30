var Q = require('q'),
  shell = require('shelljs');

var keys = {
  GIT_NAME: 'GIT_NAME',
  GIT_EMAIL: 'GIT_EMAIL',
  GIT_TOKEN: 'GH_TOKEN'
};

var GitQ = function () {
  // ...
};

GitQ.prototype = {

  setUserInfo: function (name, email) {
    var me = this;

    name = name || shell.env[keys.GIT_NAME];
    email = email || shell.env[keys.GIT_EMAIL];

    return Q.all([
      me._run('git config --global user.name "' + name + '"'),
      me._run('git config --global user.email "' + email + '"')
    ]);
  },

  writeGitCredentials: function (token) {
    var me = this;

    token = token || shell.env[keys.GIT_TOKEN];

    return new Q()
      .then(function () {
        return me._run('git config credential.helper "store --file=.git/credentials"');
      })
      .then(function () {
        return me._run('echo "https://' + token + ':@github.com" > .git/credentials');
      });
  },

  setRemoteUrl: function (url, remoteName) {
    remoteName = remoteName || 'origin';

    return this._run('git remote set-url ' + remoteName + ' ' + url);
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

module.exports = GitQ;
