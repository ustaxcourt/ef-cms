import noNewDatesRule from './eslint-no-new-dates-rule.mjs';

const noNewDatesPlugin = {
  rules: { 'no-new-dates': noNewDatesRule },
};

export default noNewDatesPlugin;
