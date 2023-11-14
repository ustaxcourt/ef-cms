/**
 * Logs in as petitioner and create a case.
 *
 * aliases:
 *  input: n/a
 *  output:
 *    - @docketNumber - the docket number of the case we created
 */
export function petitionerCreatesACase() {
  cy.login('petitioner', 'file-a-petition/step-1');
  cy.get('label#stin-file-label').should('not.have.class', 'validated');
  cy.get('input#stin-file').attachFile('../fixtures/w3-dummy.pdf');
  cy.get('label#stin-file-label').should('have.class', 'validated');
  cy.getByTestId('complete-step-1').click();
  cy.get('label#petition-file-label').should('not.have.class', 'validated');
  cy.get('input#petition-file').attachFile('../fixtures/w3-dummy.pdf');
  cy.get('label#petition-file-label').should('have.class', 'validated');
  cy.get('#irs-notice-radios label').first().click();
  cy.get('#case-type').select('Notice of Deficiency');
  cy.getByTestId('complete-step-2').click();
  cy.get('label#filing-type-1').click();
  cy.get('label#is-spouse-deceased-1').click();
  cy.getByTestId('modal-confirm').click();
  cy.get('input#name').type('John');
  cy.get('input#secondaryName').type('Sally');
  cy.get('input[name="contactPrimary.address1"]').type('111 South West St.');
  cy.get('input[name="contactPrimary.city"]').type('Orlando');
  cy.get('select[name="contactPrimary.state"]').select('AL');
  cy.get('input[name="contactPrimary.postalCode"]').type('12345');
  cy.get('input#phone').type('1111111111');
  cy.get('label#use-same-address-above-label').click();
  cy.get('input[name="contactPrimary.address1"]').should(
    'have.value',
    '111 South West St.',
  );
  cy.getByTestId('complete-step-3').click();
  cy.get('#procedure-type-radios label').eq(1).click();
  cy.get('#preferred-trial-city').select('Mobile, Alabama');
  cy.get('#procedure-type-radios label').eq(0).click();
  cy.get('#preferred-trial-city').should('have.value', '');
  cy.get('#preferred-trial-city').select('Mobile, Alabama');
  cy.getByTestId('complete-step-4').click();
  cy.get('button#petition-preview-button').click();
  cy.get('dialog.modal-screen').should('exist');
  cy.get('button#close-modal-button').click();
  cy.intercept('POST', '**/cases').as('postCase');
  cy.getByTestId('file-petition').click();
  cy.wait('@postCase').then(({ response }) => {
    expect(response?.body).to.have.property('docketNumber');
    const docketNumber = response?.body.docketNumber;
    cy.wrap(docketNumber).as('docketNumber');
    cy.url().should('include', 'file-a-petition/success');
    cy.get('a#button-back-to-dashboard').click();
    cy.goToRoute('/');
    cy.get('table').find('tr').should('contain.text', docketNumber);
  });
}
