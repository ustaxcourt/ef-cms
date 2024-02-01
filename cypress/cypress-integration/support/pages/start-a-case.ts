export const navigateTo = (username: string) => {
  cy.login(username, '/file-a-petition/step-1');
};

export const fillInAndSubmitForm = () => {
  const w3Dummy = 'w3-dummy.pdf'; // this comes from the fixtures folder

  // wizard step 1
  cy.get('input#stin-file').should('be.enabled').attachFile(w3Dummy);
  cy.get('[data-testid="upload-file-success"]');
  cy.get('button#submit-case').trigger('click');

  // wizard step 2
  cy.get('#petition-file').attachFile(w3Dummy);
  cy.get('#irs-notice-radios').scrollIntoView();
  cy.get('#irs-notice-radios label').first().click();
  cy.get('#case-type').scrollIntoView();
  cy.get('#case-type').select('Notice of Deficiency');
  cy.get('button#submit-case').trigger('click');

  //step 3
  cy.get('label[for="Individual petitioner"]').scrollIntoView();
  cy.get('label[for="Individual petitioner"]').click();

  cy.get('input#name').scrollIntoView();
  cy.get('input#name').type('John');

  cy.get('input[name="contactPrimary.address1"]').scrollIntoView();
  cy.get('input[name="contactPrimary.address1"]').type('111 South West St.');

  cy.get('input[name="contactPrimary.city"]').scrollIntoView();
  cy.get('input[name="contactPrimary.city"]').type('Orlando');

  cy.get('select[name="contactPrimary.state"]').scrollIntoView();
  cy.get('select[name="contactPrimary.state"]').select('AL');

  cy.get('input[name="contactPrimary.postalCode"]').scrollIntoView();
  cy.get('input[name="contactPrimary.postalCode"]').type('12345');

  cy.get('input#phone').scrollIntoView();
  cy.get('input#phone').type('1111111111');

  cy.get('button#submit-case').should('be.enabled').click();

  //step 4
  cy.get('#procedure-type-radios').scrollIntoView();
  cy.get('#procedure-type-radios label').first().click();
  cy.get('#preferred-trial-city').scrollIntoView();
  cy.get('#preferred-trial-city').select('Mobile, Alabama');
  cy.get('button#submit-case').scrollIntoView();
  cy.get('button#submit-case').click();

  // step 5
  cy.get('button#submit-case').scrollIntoView();
  cy.get('button#submit-case').click();

  // wait for elasticsearch to refresh
  const SLEEP = 3000;
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(SLEEP);

  // success page
  cy.url().should('include', 'file-a-petition/success');
  cy.get('a#button-back-to-dashboard').click();
};
