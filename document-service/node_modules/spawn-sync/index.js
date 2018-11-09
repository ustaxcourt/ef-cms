'use strict';

module.exports = require('child_process').spawnSync;

if (!module.exports) {
  throw new Error('spawnSync not supported by this version of node. Please upgrade to at least node@6');
}
