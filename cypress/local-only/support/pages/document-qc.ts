export const navigateTo = username => {
  cy.login(username, '/document-qc');
};

export const getCreateACaseButton = () => {
  return cy.get('a#file-a-petition');
};

export const goToDocumentNeedingQC = () => {
  cy.get('a.case-link').first().click();
};

export const createMessage = () => {
  cy.get('#case-detail-menu-button').click();
  cy.get('#menu-button-add-new-message').click();
};

export const openCompleteAndSendMessageDialog = () => {
  cy.get('button#save-and-add-supporting').click();
};

export const selectSection = (section: string) => {
  cy.get('#toSection').scrollIntoView().select(section);
};

export const selectChambers = (chamber: string) => {
  cy.get('#chambers').scrollIntoView().select(chamber);
};

export const selectRecipient = (recipient: string) => {
  cy.get('#toUserId').scrollIntoView().select(recipient);
};

export const fillOutMessageField = () => {
  cy.get('#message').clear().type("I don't appreciate your lack of sarcasm.");
};

export const enterSubject = () => {
  cy.get('#subject').clear().type('Demeanor');
};

export const sendMessage = () => {
  cy.get('#confirm').click();
};

export const progressIndicatorDoesNotExist = () => {
  cy.get('.progress-indicator').should('not.exist');
};

export const uploadCourtIssuedDocumentAndEditViaDocumentQC = () => {
  cy.visit('case-detail/104-20/upload-court-issued');
  const freeText = `court document ${Math.random()}`;
  cy.get('#upload-description').clear();
  cy.get('#upload-description').type(freeText);
  cy.get('input#primary-document-file').attachFile('../fixtures/w3-dummy.pdf');
  cy.get('[data-testid="upload-file-success"]');
  cy.get('#save-uploaded-pdf-button').click();
  cy.get('#add-court-issued-docket-entry-button').click();
  cy.get('#document-type .select-react-element__input-container input').clear();
  cy.get('#document-type .select-react-element__input-container input').type(
    'Miscellaneous',
  );
  cy.get('#react-select-2-option-0').click({ force: true });
  cy.get('#save-entry-button').click();
  cy.url().should('not.contain', '/add-court-issued-docket-entry');

  cy.visit('document-qc/my/inProgress');
  cy.get('.case-link').contains(freeText).click();
  cy.get('h1').contains('Edit Docket Entry');
  cy.url().should('include', 'edit-court-issued');
};
