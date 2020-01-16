module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:prettier/recommended',
    'plugin:react/recommended',
    'plugin:security/recommended',
    'prettier/react',
    'prettier/standard',
    'plugin:import/errors',
  ],
  plugins: [
    'cypress',
    'eslint-plugin-sort-imports-es6-autofix',
    'import',
    'jest',
    'jsdoc',
    'jsx-a11y',
    'prettier',
    'react',
    'security',
    'sort-destructure-keys',
    'sort-keys-fix',
    'sort-requires',
    'spellcheck',
  ],
  rules: {
    'import/named': 1,
    'no-prototype-builtins': 0,
    'react/prop-types': 0,
    'require-atomic-updates': 0,
    'security/detect-child-process': 0,
    'security/detect-non-literal-fs-filename': 0,
    'security/detect-object-injection': 0,
    'react/jsx-sort-props': [
      'error',
      {
        callbacksLast: true,
        shorthandFirst: true,
        shorthandLast: false,
        ignoreCase: false,
        noSortAlphabetically: false,
      },
    ],
    'arrow-parens': ['error', 'as-needed'],
    'jsdoc/check-param-names': 1,
    'jsdoc/check-types': 1,
    'jsdoc/newline-after-description': 1,
    'jsdoc/require-jsdoc': 1,
    'jsdoc/require-param-description': 1,
    'jsdoc/require-param-name': 1,
    'jsdoc/require-param-type': 1,
    'jsdoc/require-param': 1,
    'jsdoc/require-returns-check': 1,
    'jsdoc/require-returns-description': 1,
    'jsdoc/require-returns-type': 1,
    'jsdoc/require-returns': 1,
    'jsdoc/valid-types': 1,
    'no-underscore-dangle': ['error', { allowAfterThis: true }],
    'no-warning-comments': [
      'error',
      { terms: ['fixme', 'xxx'], location: 'anywhere' },
    ],
    'prettier/prettier': 'error',
    quotes: ['error', 'single', { avoidEscape: true }],
    'jsx-a11y/anchor-is-valid': [
      'error',
      {
        components: ['Link'],
        specialLink: ['to'],
      },
    ],
    'jsx-a11y/label-has-for': [
      2,
      {
        components: ['Label'],
        required: {
          every: ['id'],
        },
        allowChildren: false,
      },
    ],
    'no-irregular-whitespace': [2, { skipStrings: false }],
    'sort-imports-es6-autofix/sort-imports-es6': [
      2,
      {
        ignoreCase: false,
        ignoreMemberSort: false,
        memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
      },
    ],
    'sort-keys-fix/sort-keys-fix': [
      'error',
      'asc',
      { caseSensitive: true, natural: true },
    ],
    'sort-destructure-keys/sort-destructure-keys': [
      2,
      { caseSensitive: false },
    ],
    'prefer-destructuring': [
      'error',
      {
        VariableDeclarator: {
          array: false,
          object: true,
        },
        AssignmentExpression: {
          array: false,
          object: true,
        },
      },
      {
        enforceForRenamedProperties: false,
      },
    ],
    'sort-requires/sort-requires': 2,
    'spellcheck/spell-checker': [
      1,
      {
        comments: true,
        strings: true,
        identifiers: false,
        templates: false,
        lang: 'en_US',
        skipWords: [
          'anthony',
          'args',
          'armen',
          'armens',
          'ashford',
          'ashfords',
          'assignee',
          'async',
          'attributors',
          'backend',
          'binded',
          'boolean',
          'booleans',
          'buch',
          'buchs',
          'calendarclerk',
          'cancelable',
          'carluzzo',
          'carluzzos',
          'checkbox',
          'cognito',
          'cohen',
          'cohens',
          'colvin',
          'colvins',
          'contentinfo',
          'copelands',
          'cors',
          'coversheet',
          'desc',
          'disallowance',
          'docketclerk',
          'doctype',
          'douglass',
          'dynam',
          'dynamodb',
          'dynamsoft',
          'efcms',
          'elasticsearch',
          'eslint',
          'falsy',
          'fieldset',
          'fieri',
          'flavortown',
          'focusable',
          'foleys',
          'fontawesome',
          'formatter',
          'fortawesome',
          'gerbers',
          'getter',
          'globals',
          'goeke',
          'goekes',
          'goto',
          'gsi1',
          'gsi1pk',
          'gustafson',
          'gustafsons',
          'halpern',
          'halperns',
          'holmes',
          'hoverable',
          'href',
          'html',
          'http',
          'https',
          'iframe',
          'interactor',
          'irs',
          'istanbul',
          'jacobs',
          'jpg',
          'jsdom',
          'kerrigan',
          'kerrigans',
          'keydown',
          'labelledby',
          'lauber',
          'laubers',
          'leyden',
          'leydens',
          'listitem',
          'localhost',
          'lodash',
          'maxw',
          'memoranda',
          'metadata',
          'middleware',
          'middlewares',
          'minw',
          'morrisons',
          'mousedown',
          'multipart',
          'namespace',
          'navbar',
          'nega',
          'negas',
          'noop',
          'noopener',
          'noreferrer',
          'overline',
          'panuthos',
          'panuthos',
          'param',
          'params',
          'paris',
          'pdfjs',
          'petitionsclerk',
          'petr',
          'petrs',
          'polyfill',
          'postfix',
          'prepends',
          'pughs',
          'px',
          'ramsay',
          'rect',
          'reindex',
          'renderer',
          'rescan',
          'riker',
          'ruwe',
          'ruwes',
          'scss',
          'semibold',
          'seriatim',
          'servoss',
          'sinon',
          'sisqo',
          'skipnav',
          'sortable',
          'stanton',
          'stin',
          'stip',
          'submenu',
          'tabbable',
          'tabindex',
          'tablist',
          'tabpanel',
          'templated',
          'textarea',
          'thorton',
          'thortons',
          'touchmove',
          'transferee',
          'truthy',
          'tubman',
          'uint',
          'uniq',
          'unmount',
          'unprioritize',
          'unprocessable',
          'unset',
          'unsets',
          'unsetting',
          'unstash',
          'unstyled',
          'unsworn',
          'urda',
          'urdas',
          'usa',
          'ustaxcourt',
          'ustc',
          'uuid',
          'uuidv4',
          'vasquezs',
          'viewport',
          'washington',
          'whistleblower',
          'whitelist',
          'wicg',
          'workitem',
          'workitems',
          'xpos',
        ],
        skipIfMatch: ['^https?://[^\\s]*$', '^[^\\s]{35,}$'],
        minLength: 4,
      },
    ],
  },
  settings: {
    react: {
      version: '16.12.0',
    },
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx'],
      },
    },
  },
  env: {
    'cypress/globals': true,
    'jest/globals': true,
    browser: true,
    es6: true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: 9,
    jsx: true,
    sourceType: 'module',
  },
  parser: 'babel-eslint',
};
