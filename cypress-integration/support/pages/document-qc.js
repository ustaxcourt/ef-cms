exports.navigateTo = username => {
  cy.login(username, '/document-qc');
};

exports.getCreateACaseButton = () => {
  return cy.get('a#file-a-petition');
};

exports.goToDocumentNeedingQC = () => {
  cy.get('a.case-link').first().click();
};

exports.createMessage = () => {
  cy.get('#case-detail-menu-button').click();
  cy.get('#menu-button-add-new-message').click();
};

exports.openCompleteAndSendMessageDialog = () => {
  cy.get('button#save-and-add-supporting').click();
};

exports.selectSection = section => {
  cy.get('#toSection').scrollIntoView().select(section);
};

exports.selectRecipient = recipient => {
  cy.get('#toUserId').scrollIntoView().select(recipient);
};

exports.fillOutMessageField = () => {
  cy.get('#message').clear().type("I don't appreciate your lack of sarcasm.");
};

exports.enterSubject = () => {
  cy.get('#subject').clear().type('Demeanor');
};

exports.sendMessage = () => {
  cy.get('#confirm').click();
};

exports.progressIndicatorDoesNotExist = () => {
  cy.get('.progress-indicator').should('not.exist');
};
