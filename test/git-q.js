var GitQ = require('../lib/git-q'),
  Q = require('q'),
  sinon = require('sinon'),
  chai = require('chai'),
  assert = chai.assert,
  actual;

var runMock = function(gitCommand) {
  var deferred = Q.defer();
  actual.push(gitCommand);
  deferred.resolve();
  return deferred.promise;
};

beforeEach(function(){
  actual = [];
});

afterEach(function(){
  actual = [];
})

describe('git-q', function () {

  it('should exist', function () {
    assert.ok(GitQ);
  });

  describe('fetch', function(){

    it('runs without --tags when tag is not specified', function (done) {
      var gitQ = new GitQ();
      sinon.stub(gitQ, '_run', runMock);

      gitQ
        .fetch()
        .then(function(){
          assert.strictEqual(actual[0], 'git fetch');
          done();
        });
    });

    it('runs with --tags when tag flag is passed through', function (done) {
      var gitQ = new GitQ();
      sinon.stub(gitQ, '_run', runMock);

      gitQ
        .fetch(true)
        .then(function(){
          assert.strictEqual(actual[0], 'git fetch --tags');
          done();
        });
    });

  });

  describe('tag', function () {

    it('runs with more than one tag option provided', function (done) {
      var gitQ = new GitQ();
      sinon.stub(gitQ, '_run', runMock);

      gitQ
        .tag({m: '"tagging message"', a: 'v1.4'})
        .then(function(){
          assert.strictEqual(actual[0], 'git tag -m "tagging message" -a v1.4');
          done();
        });
    });

    it('runs for a lightweight tag (doesn\'t use -a, -s, or -m options)', function (done) {
      var gitQ = new GitQ();
      sinon.stub(gitQ, '_run', runMock);

      gitQ
        .tag('v1.4-lw')
        .then(function(){
          assert.strictEqual(actual[0], 'git tag v1.4-lw');
          done();
        });
    });

  });

});
