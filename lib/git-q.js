var Q = require('q'),
  shell = require('shelljs'),
  _ = require('lodash');

var keys = {
  GIT_NAME: 'GIT_NAME',
  GIT_EMAIL: 'GIT_EMAIL',
  GIT_TOKEN: 'GH_TOKEN'
};

var flattenObject = function(obj, separator){
  var separateKeyValuePairs = function(result, value, key){
    result += '-' + key + separator + value + ' ';
    return result;
  };

  return _.reduce(obj, separateKeyValuePairs, '').trim();
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

  fetch: function (tags) {
    var tagCommand = tags ? ' --tags' : '';

    return this._run('git fetch' + tagCommand);
  },

  tag: function (options) {
    var option = options;

    if (_.isObject(options)) {
      option = flattenObject(options, ' ');
    }

    return this._run('git tag ' + option);
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
