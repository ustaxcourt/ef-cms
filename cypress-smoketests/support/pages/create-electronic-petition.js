exports.goToStartCreatePetition = () => {
  cy.get('a#file-a-petition').click();
};

exports.goToWizardStep1 = () => {
  cy.get('a[href*="file-a-petition/step-1"]').click();
};

exports.goToWizardStep2 = () => {
  cy.get('button#submit-case').click();
};

exports.goToWizardStep3 = () => {
  cy.get('button#submit-case').click();
};

exports.goToWizardStep4 = () => {
  cy.get('button#submit-case').click();
};

exports.goToWizardStep5 = () => {
  cy.get('button#submit-case').click();
};

exports.submitPetition = () => {
  cy.get('button#submit-case').scrollIntoView().click();
};

exports.goToDashboard = () => {
  cy.get('a#button-back-to-dashboard').click();
};

exports.completeWizardStep1 = () => {
  cy.upload_file('w3-dummy.pdf', 'input#stin-file');
};

exports.completeWizardStep2 = () => {
  cy.upload_file('w3-dummy.pdf', 'input#petition-file');
  cy.get('#irs-notice-radios').scrollIntoView();
  cy.get('#irs-notice-radios label').first().click();
  cy.get('#case-type').scrollIntoView().select('Notice of Deficiency');
};

exports.completeWizardStep3 = () => {
  cy.get('label#filing-type-0').scrollIntoView().click();
  cy.get('input#name').scrollIntoView().type('John');
  cy.get('input[name="contactPrimary.address1"]')
    .scrollIntoView()
    .type('111 South West St.');
  cy.get('input[name="contactPrimary.city"]').scrollIntoView().type('Orlando');
  cy.get('select[name="contactPrimary.state"]').scrollIntoView().select('AL');
  cy.get('input[name="contactPrimary.postalCode"]')
    .scrollIntoView()
    .type('12345');
  cy.get('input#phone').scrollIntoView().type('1111111111');
};

exports.completeWizardStep4 = () => {
  cy.get('label#procedure-type-0').scrollIntoView().click();
  cy.get('#preferred-trial-city').scrollIntoView().select('Mobile, Alabama');
};
