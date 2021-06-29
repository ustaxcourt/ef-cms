exports.navigateTo = username => {
  cy.login(username, '/file-a-petition/step-1');
};

exports.fillInAndSubmitForm = () => {
  //wizard step 1
  cy.get('input#stin-file').attachFile('../fixtures/w3-dummy.pdf');

  cy.get('button#submit-case').click();

  //step 2
  cy.get('#petition-file').attachFile('../fixtures/w3-dummy.pdf');

  cy.get('#irs-notice-radios').scrollIntoView();
  cy.get('#irs-notice-radios label').first().click();
  cy.get('#case-type').scrollIntoView().select('Notice of Deficiency');
  cy.get('button#submit-case').click();

  //step 3
  cy.get('label[for="Individual petitioner"]').scrollIntoView().click();
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
  cy.get('button#submit-case').click();

  //step 4
  cy.get('#procedure-type-radios').scrollIntoView();
  cy.get('#procedure-type-radios label').first().click();
  cy.get('#preferred-trial-city').scrollIntoView().select('Mobile, Alabama');
  cy.get('button#submit-case').scrollIntoView().click();

  // step 5
  cy.get('button#submit-case').scrollIntoView().click();

  // wait for elasticsearch to refresh
  const SLEEP = 3000;
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(SLEEP);

  // success page
  cy.url().should('include', 'file-a-petition/success');
  cy.get('a#button-back-to-dashboard').click();
};
