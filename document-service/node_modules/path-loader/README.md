# path-loader

Utility that provides a single API for loading the content of a path/URL.  This module works in the browser and in
io.js/Node.js.  Right now this module supports the following loaders:

* http/https: This loader is used by default in the browser and will also be used in io.js/Node.js if the location being
loaded starts with `http:` or `https:`
* file: This loader is the used by default in io.js/Node.js and will throw an error in the browser _(Due to how
locations are mapped to loaders, the only way to use the `file` loader in the browser is to attempt to load a file using
the URL-version of its location.  (Example: `file:///Users/not-you/projects/path-loader/package.json`))_

In the future, there will likely be a pluggable infrastructure for altering this list or overriding the loaders provided
by the project but for now that is not an option.

## Project Badges

* Build status: [![Build Status](https://travis-ci.org/whitlockjc/path-loader.svg)](https://travis-ci.org/whitlockjc/path-loader)
* Dependencies: [![Dependencies](https://david-dm.org/whitlockjc/path-loader.svg)](https://david-dm.org/whitlockjc/path-loader)
* Developer dependencies: [![Dev Dependencies](https://david-dm.org/whitlockjc/path-loader/dev-status.svg)](https://david-dm.org/whitlockjc/path-loader#info=devDependencies&view=table)
* Downloads: [![NPM Downloads Per Month](http://img.shields.io/npm/dm/path-loader.svg)](https://www.npmjs.org/package/path-loader)
* Gitter: [![Join the chat at https://gitter.im/whitlockjc/path-loader](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/whitlockjc/path-loader?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
* License: [![License](http://img.shields.io/npm/l/path-loader.svg)](https://github.com/whitlockjc/path-loader/blob/master/LICENSE)
* Version: [![NPM Version](http://img.shields.io/npm/v/path-loader.svg)](https://www.npmjs.org/package/path-loader)

## Installation

path-loader is available for both Node.js and the browser.  Installation instructions for each environment are below.

### Browser

Installation for browser applications can be done via [Bower][bower] or by downloading a standalone binary.

#### Using Bower

```
bower install path-loader --save
```

#### Standalone Binaries

The standalone binaries come in two flavors:

* [path-loader.js](https://raw.github.com/whitlockjc/path-loader/master/browser/path-loader.js): _112kb_, full source  and source maps
* [path-loader-min.js](https://raw.github.com/whitlockjc/path-loader/master/browser/path-loader-min.js): _16kb_, minified, compressed and no sourcemap

### Node.js

Installation for Node.js applications can be done via [NPM][npm].

```
npm install path-loader --save
```

## Documentation

The documentation for this project can be found here: https://github.com/whitlockjc/path-loader/blob/master/docs/README.md

[bower]: http://bower.io/
[npm]: https://www.npmjs.com/
