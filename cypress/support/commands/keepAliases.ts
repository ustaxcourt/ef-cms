Cypress.Commands.add('keepAliases', function (aliasList) {
  if (!aliasList) {
    aliasList = Object.keys(this).filter(
      key => !['test', '_runnable', 'currentTest'].includes(key),
    );
  }
  aliasList.forEach(key => {
    cy.wrap(this[key]).as(key);
  });
});
