exports.goToMyDocumentQC = () => {
  cy.get('a[href*="document-qc/my/inbox"]').click();
  cy.get('.big-blue-header').should('exist');
};

exports.goToSectionDocumentQC = () => {
  cy.get('button:contains("Switch to Section Document QC")').click();
};

exports.goToPetitionNeedingQC = () => {
  cy.get('a[href*="petition-qc"]').first().click();
};

exports.goToDocumentNeedingQC = () => {
  cy.get('a.case-link').first().click();
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
  cy.get('#message').type("I don't appreciate your lack of sarcasm.");
};

exports.sendMessage = () => {
  cy.get('#confirm').click();
};

exports.goToPetitionNeedingQCByCaseTitle = caseTitle => {
  cy.get(`td:contains(${caseTitle})`)
    .first()
    .parent()
    .find('a[href*="petition-qc"]')
    .click();
};

exports.goToReviewPetition = () => {
  cy.get('button#submit-case').click();
};

exports.savePetitionForLater = () => {
  cy.get('button:contains("Save for Later")').click();

  cy.get('div.usa-alert--success').should('exist');
};

exports.selectTab = tabName => {
  cy.get(`button#tab-${tabName}`).click();
};

exports.selectCaseType = caseType => {
  cy.get('#case-type').scrollIntoView().select(caseType);
};

exports.addStatistic = (year, deficiencyAmount, totalPenalties) => {
  cy.get('input[id^=year-]').last().type(year);
  cy.get('input[id^=deficiency-amount-]').last().type(deficiencyAmount);
  cy.get('input[id^=total-penalties-]').last().type(totalPenalties);
};

exports.servePetition = () => {
  cy.get('#ustc-start-a-case-form button#submit-case').scrollIntoView().click();
};

exports.confirmServePetition = () => {
  cy.get('button#confirm').click();

  cy.get('div.usa-alert--success').should('exist');
};

exports.progressIndicatorDoesNotExist = () => {
  cy.get('.progress-indicator').should('not.exist');
};
