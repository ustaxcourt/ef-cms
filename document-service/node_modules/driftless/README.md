# `driftless` [![Build Status](https://travis-ci.org/dbkaplun/driftless.svg?branch=master)](https://travis-ci.org/dbkaplun/driftless)

Driftless setInterval and setTimeout replacement for Node and the browser

[![comparison](https://github.com/dbkaplun/driftless/raw/master/comparison.gif)](https://asciinema.org/a/183890)

## Usage

```
npm install driftless
```

```js
import {
  setDriftlessTimeout,
  setDriftlessInterval,
  clearDriftless,
} from 'driftless';
// Use like setTimeout and setInterval
```

## How it works

`driftless` repeatedly calls setTimeout in advance of the requested timeout for
greater accuracy. It does this recursively, until the timeout is reached within
a given threshold.
