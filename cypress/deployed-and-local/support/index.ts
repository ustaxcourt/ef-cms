import '../../support/commands';

before(() => {
  // Skip subsequent tests in spec when one fails.
  (cy.state('runnable').ctx as Mocha.Context).currentTest.parent.bail(true);
});
