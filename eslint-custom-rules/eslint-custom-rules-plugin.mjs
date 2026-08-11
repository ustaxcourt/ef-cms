import { createRequire } from 'node:module';
import noDatesRule from './eslint-no-new-dates-rule.mjs';

const require = createRequire(import.meta.url);
const joiIsoDateUtcRule = require('./eslint-joi-iso-date-utc-rule.js');

const noDatesPlugin = {
  rules: {
    'joi-iso-date-utc': joiIsoDateUtcRule,
    'no-dates': noDatesRule,
  },
};

export default noDatesPlugin;
