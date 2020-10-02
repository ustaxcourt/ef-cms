const faker = require('faker');

faker.seed(faker.random.number());

exports.goToCaseDetail = docketNumber => {
  cy.get('#search-field').type(docketNumber);
  cy.get('.ustc-search-button').click();
  cy.get(`.big-blue-header h1 a:contains("${docketNumber}")`).should('exist');
};

exports.goToCaseOverview = docketNumber => {
  cy.goToRoute(`/case-detail/${docketNumber}`);
  cy.get('#tab-case-information').click();
  cy.get('#tab-overview').click();
};

exports.createOrder = docketNumber => {
  cy.goToRoute(
    `/case-detail/${docketNumber}/create-order?documentTitle=Order to Show Cause&documentType=Order to Show Cause&eventCode=OSC`,
  );
  cy.url().should('contain', '/create-order');
  cy.get('.ql-editor').type('A created order!');
  cy.get('#save-order-button').click();
  cy.url().should('contain', '/sign');
  cy.get('#skip-signature-button').click();
  cy.url().should('not.contain', '/sign');
};

exports.editAndSignOrder = () => {
  cy.get('#draft-edit-button-not-signed').click();
  cy.url().should('contain', '/edit-order');
  cy.get('.ql-editor').type('edited');
  cy.get('#save-order-button').click();
  cy.url().should('contain', '/sign');
  cy.get('#sign-pdf-canvas').click();
  cy.get('#save-signature-button').click();
  cy.url().should('not.contain', '/sign');
};

exports.addDocketEntryForOrderAndSaveForLater = () => {
  cy.get('#add-court-issued-docket-entry-button').click();
  cy.url().should('contain', '/add-court-issued-docket-entry');
  cy.get('#save-entry-button').click();
  cy.url().should('not.contain', '/add-court-issued-docket-entry');
  cy.get('button:contains("Order to Show Cause")').click();
  cy.get('h3:contains("Order to Show Cause")').should('exist');
  cy.get('span:contains("Not served")').should('exist');
};

exports.serveCourtIssuedDocketEntry = () => {
  cy.get('button:contains("Serve")').click();
  cy.get('.modal-button-confirm').click();
  cy.get('h3:contains("Order to Show Cause")').should('exist');
  cy.get('div:contains("Served")').should('exist');
};

exports.addDocketEntryForOrderAndServePaper = () => {
  cy.get('#add-court-issued-docket-entry-button').click();
  cy.url().should('contain', '/add-court-issued-docket-entry');
  cy.get('#serve-to-parties-btn').click();
  cy.get('.modal-button-confirm').click();
  cy.url().should('contain', '/print-paper-service');
  cy.get('#print-paper-service-done-button').click();
  cy.get('button:contains("Order to Show Cause")').click();
  cy.get('h3:contains("Order to Show Cause")').should('exist');
  cy.get('div:contains("Served")').should('exist');
};

exports.addDocketEntryForUploadedPdfAndServe = () => {
  cy.get('#add-court-issued-docket-entry-button').click();
  cy.url().should('contain', '/add-court-issued-docket-entry');
  cy.get('#serve-to-parties-btn').click();
  cy.get('.modal-button-confirm').click();
  cy.url().should('not.contain', '/add-court-issued-docket-entry');
  cy.get('button:contains("An Uploaded PDF")').click();
  cy.get('h3:contains("An Uploaded PDF")').should('exist');
  cy.get('div:contains("Served")').should('exist');
};

exports.addDocketEntryForUploadedPdfAndServePaper = () => {
  cy.get('#add-court-issued-docket-entry-button').click();
  cy.url().should('contain', '/add-court-issued-docket-entry');
  cy.get('#serve-to-parties-btn').click();
  cy.get('.modal-button-confirm').click();
  cy.url().should('contain', '/print-paper-service');
  cy.get('#print-paper-service-done-button').click();
  cy.url().should('not.contain', '/print-paper-service');
  cy.get('button:contains("An Uploaded PDF")').click();
  cy.get('h3:contains("An Uploaded PDF")').should('exist');
  cy.get('div:contains("Served")').should('exist');
};

exports.uploadCourtIssuedDocPdf = () => {
  cy.get('#case-detail-menu-button').click();
  cy.get('#menu-button-upload-pdf').click();
  cy.url().should('contain', '/upload-court-issued');
  cy.get('#upload-description').type('An Uploaded PDF');
  cy.upload_file('w3-dummy.pdf', 'input#primary-document-file');
  cy.get('#save-uploaded-pdf-button').click();
  cy.get('h1:contains("Drafts")').should('exist');
  cy.get('h3:contains("An Uploaded PDF")').should('exist');
};

exports.manuallyAddCaseToNewTrialSession = trialSessionId => {
  cy.get('#add-to-trial-session-btn').should('exist').click();
  cy.get('label[for="show-all-locations-true"]').click();
  cy.get('select#trial-session')
    .select(trialSessionId)
    .should('have.value', trialSessionId);
  cy.get('#modal-root .modal-button-confirm').click();
  cy.get('.usa-alert--success').should('contain', 'Case scheduled for trial.');
  cy.get('h3:contains("Trial - Scheduled")').should('exist');
};

exports.manuallyAddCaseToCalendaredTrialSession = trialSessionId => {
  cy.get('#add-to-trial-session-btn').should('exist').click();
  cy.get('label[for="show-all-locations-true"]').click();
  cy.get('select#trial-session')
    .select(trialSessionId)
    .should('have.value', trialSessionId);
  cy.get('#modal-root .modal-button-confirm').click();
  cy.get('.usa-alert--success').should('contain', 'Case set for trial.');
};

exports.removeCaseFromTrialSession = () => {
  cy.get('#remove-from-trial-session-btn').should('exist').click();
  cy.get('#disposition').type(faker.company.catchPhrase());
  cy.get('#modal-root .modal-button-confirm').click();
  cy.get('#add-to-trial-session-btn').should('not.exist');
};

exports.blockCaseFromTrial = () => {
  cy.get('#tabContent-overview .block-from-trial-btn').click();
  cy.get('.modal-dialog #reason').type(faker.company.catchPhrase());
  cy.get('.modal-dialog .modal-button-confirm').click();
  cy.contains('Blocked From Trial');
};

exports.unblockCaseFromTrial = () => {
  cy.get('#remove-block').click();
  cy.get('.modal-button-confirm').click();
  cy.contains('Block removed.');
};

exports.setCaseAsHighPriority = () => {
  cy.get('.high-priority-btn').click();
  cy.get('#reason').type(faker.company.catchPhrase());
  cy.get('.modal-button-confirm').click();
  cy.get('.modal-dialog').should('not.exist');
  cy.contains('High Priority').should('exist');
};
