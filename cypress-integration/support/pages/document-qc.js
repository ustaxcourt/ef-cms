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

exports.uploadCourtIssuedDocumentAndEditViaDocumentQC = attempt => {
  cy.visit('case-detail/104-20/upload-court-issued');
  const freeText = `court document ${attempt}`;
  cy.get('#upload-description').clear().type(freeText);
  cy.get('input#primary-document-file').attachFile('../fixtures/w3-dummy.pdf');
  cy.get('#save-uploaded-pdf-button').click();
  cy.get('#add-court-issued-docket-entry-button').click();
  cy.get('#document-type .select-react-element__input-container input')
    .clear()
    .type('Miscellaneous');
  cy.get('#react-select-2-option-0').click({ force: true });
  cy.get('#save-entry-button').click();
  cy.url().should('not.contain', '/add-court-issued-docket-entry');

  cy.visit('document-qc/my/inProgress');
  cy.get('.case-link').contains(freeText).click();
  cy.get('h1').contains('Edit Docket Entry');
  cy.url().should('include', 'edit-court-issued');
};
