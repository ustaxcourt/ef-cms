exports.navigateTo = username => {
  cy.login(username, '/start-a-case');
};

exports.fillInAndSubmitForm = () => {
  cy.upload_file('w3-dummy.pdf', 'form #petition-file');
  cy.upload_file('w3-dummy.pdf', 'form #stin-file');
  cy.get('label[for="Individual petitioner"]')
    .scrollIntoView()
    .click();
  cy.get('input#name')
    .scrollIntoView()
    .type('John');
  cy.get('input[name="contactPrimary.address1"]')
    .scrollIntoView()
    .type('111 South West St.');
  cy.get('input[name="contactPrimary.city"]')
    .scrollIntoView()
    .type('Orlando');
  cy.get('select[name="contactPrimary.state"]')
    .scrollIntoView()
    .select('AL');
  cy.get('input[name="contactPrimary.postalCode"]')
    .scrollIntoView()
    .type('12345');
  cy.get('input#phone')
    .scrollIntoView()
    .type('1111111111');
  cy.get('#irs-notice-radios').scrollIntoView();
  cy.get('#irs-notice-radios label')
    .first()
    .click();
  cy.get('#case-type')
    .scrollIntoView()
    .select('Notice of Deficiency');
  cy.get('#date-of-notice-month')
    .scrollIntoView()
    .type('01');
  cy.get('#date-of-notice-day')
    .scrollIntoView()
    .type('19');
  cy.get('#date-of-notice-year')
    .scrollIntoView()
    .type('1999');
  cy.get('#procedure-type-radios').scrollIntoView();
  cy.get('#procedure-type-radios label')
    .first()
    .click();
  cy.get('#filing-type-radios').scrollIntoView();
  cy.get('#filing-type-radios label')
    .first()
    .click();

  cy.get('#preferred-trial-city')
    .scrollIntoView()
    .select('Mobile, Alabama');
  cy.get('#signature + label')
    .scrollIntoView()
    .click();
  cy.get('form button#submit-case')
    .scrollIntoView()
    .click();
};
