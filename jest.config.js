// a global config if running tests singly on CLI
module.exports = {
  clearMocks: true,
  collectCoverage: false,
  coverageThreshold: {
    global: {
      branches: 95,
      functions: 95,
      lines: 95,
      statements: 95,
    },
  },
  globals: {
    File: function() {},
    FileReader: () => {},
    atob: x => x,
    window: { document: {} },
  },
  verbose: true,
};
