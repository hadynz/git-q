Q Git
==========

[![Build Status](https://travis-ci.org/hadynz/git-q.svg)](https://travis-ci.org/hadynz/git-q)

Thin Q promise wrapper for Git.

## About

Promise-based wrapper based on [Q][1] that provides an asynchronous interface to Git.

The motivation behind this project was to create a promise wrapper for Git to be used when scripting
[Travis-CI][3] deployments.

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
...

This method is used whenever

### gitQ.writeGitCredentials([token])
...

### gitQ.setRemoteUrl(url, [remoteName])
Sets a remote `url` against a `remoteName` which defaults to `origin`. This method runs the following Git command:

```
git remote set-url <remoteName> <url>
```

### gitQ.fetch([tags])
Runs `git fetch` with the `--tags` option if `tags` is `true`.

```
// Fetches all branch heads and all commits.
git fetch

// Fetches all tags and commits. Will not update branch heads.
git fetch --tags
```

### gitQ.tag(options)
Runs `git tag`. If `options` is an `Object`, method will assume it is a collection of annotated tags and append
it to the `git tag` command after flattening the structure. If `options` is a string, command will use the latter
and run it as a lightweight tag.

```
// Lightweight Tags
git tag v1.4-lw

// Annotated Tags
git tag -a v1.4 -m 'my version 1.4'
```

### gitQ.pushTags()
...

## License

MIT

[1]: https://github.com/kriskowal/q
[2]: https://help.github.com/articles/about-remote-repositories/
[3]: https://travis-ci.com/
