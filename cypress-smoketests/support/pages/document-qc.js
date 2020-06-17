exports.navigateToMySectionInbox = () => {
  return cy.get('a[href*="document-qc/my/inbox"]').click();
};
