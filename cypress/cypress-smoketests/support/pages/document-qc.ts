export const goToMyDocumentQC = () => {
  cy.get('a[href*="document-qc/my/inbox"]').click();
  cy.get('.big-blue-header').should('exist');
};

export const goToSectionDocumentQC = () => {
  cy.get('button:contains("Switch to Section Document QC")').click();
};

export const goToPetitionNeedingQC = () => {
  cy.get('a[href*="petition-qc"]').first().click();
};

export const goToPetitionNeedingQCByCaseTitle = caseTitle => {
  cy.get(`td:contains(${caseTitle})`)
    .first()
    .parent()
    .find('a[href*="petition-qc"]')
    .click();
};

export const goToReviewPetition = () => {
  cy.get('button#submit-case').click();
};

export const savePetitionForLater = () => {
  cy.get('button:contains("Save for Later")').click();

  cy.get('div.usa-alert--success').should('exist');
};

export const selectTab = tabName => {
  cy.get(`button#tab-${tabName}`).click();
};

export const selectCaseType = caseType => {
  cy.get('#case-type').scrollIntoView().select(caseType);
};

export const addStatistic = (year, deficiencyAmount, totalPenalties) => {
  cy.get('input[id^=year-]').last().type(year);
  cy.get('input[id^=deficiency-amount-]').last().type(deficiencyAmount);
  cy.get('input[id^=total-penalties-]').last().type(totalPenalties);
};

export const servePetition = () => {
  cy.get('#ustc-start-a-case-form button#submit-case').scrollIntoView().click();
};

export const confirmServePetition = () => {
  cy.get('button#confirm').click();

  cy.get('div.usa-alert--success').should('exist');
};
