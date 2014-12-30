Q Git
==========

Thin Q promise wrapper for Git.

## About

Promise-based wrapper based on [Q][1] that provides an asynchronous interface to Git.

## Install

With [npm](http://npmjs.org) do:

```
npm install git-q --save
```

## Usage

```javascript
var GitQ = require('git-q'),
  gitQ = new GitQ();

gitQ
  .setUserInfo()
  .writeGitCredentials()
  .setRemoteUrl('https://...')
  .fetchTags()
  .tag('1.0.1', 'Commit message associated with tag')
  .pushTags()
  .catch(function(){
    // Handle any errors from any of the above steps
  })
  .done();
```

## API

### var gitQ = GitQ()
Initialise a `GitQ` wrapper object for Git.

### gitQ.setUserInfo([name], [email])

### gitQ.writeGitCredentials([token])

### gitQ.setRemoteUrl(url)

### gitQ.fetchTags()

### gitQ.tag(tagName, message)

### gitQ.pushTags()

## License

MIT

[1]: https://github.com/kriskowal/q
