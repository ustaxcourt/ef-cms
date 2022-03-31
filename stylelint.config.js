module.exports = {
  extends: [
    'stylelint-config-standard-scss',
    'stylelint-config-idiomatic-order',
    'stylelint-config-recommended',
  ],
  rules: {
    'function-no-unknown': [
      true,
      {
        ignoreFunctions: ['units'],
      },
    ],
    'no-descending-specificity': null,
    'selector-class-pattern': null,
    'shorthand-property-no-redundant-values': null,
    'string-quotes': 'single',
  },
};
