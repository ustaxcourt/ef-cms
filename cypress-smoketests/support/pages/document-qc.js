exports.goToMyDocumentQC = () => {
  cy.get('a[href*="document-qc/my/inbox"]').click();
};

exports.goToSectionDocumentQC = () => {
  cy.get('button:contains("Switch to Section Document QC")').click();
};

exports.goToPetitionNeedingQC = () => {
  cy.get('a[href*="petition-qc"]').first().click();
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
