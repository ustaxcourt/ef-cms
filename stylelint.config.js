module.exports = {
  extends: [
    'stylelint-config-standard-scss',
    'stylelint-config-idiomatic-order',
    'stylelint-config-recommended',
  ],
  overrides: [
    {
      files: ['*.scss'],
      rules: {
        'media-query-no-invalid': null,
      },
    },
  ],
  rules: {
    'at-rule-no-unknown': null,
    'function-no-unknown': [
      true,
      {
        ignoreFunctions: ['units'],
      },
    ],
    'no-descending-specificity': null,
    'selector-class-pattern': null,
    'shorthand-property-no-redundant-values': null,
  },
};
