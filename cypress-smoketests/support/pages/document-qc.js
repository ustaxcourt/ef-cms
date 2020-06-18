exports.goToMySectionInbox = () => {
  cy.get('a[href*="document-qc/my/inbox"]').click();
};
