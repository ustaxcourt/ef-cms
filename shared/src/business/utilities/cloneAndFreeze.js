const deepFreeze = require('deep-freeze');
const { cloneDeep } = require('lodash');
exports.cloneAndFreeze = obj => deepFreeze(cloneDeep(obj));
