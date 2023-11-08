/**
 * Logs in as petitioner and create a case.
 */
export function petitionerCreatesACase() {
  cy.login('petitioner', 'file-a-petition/step-1');
  cy.getByTestId('stin-file-label').should('not.have.class', 'validated');
  cy.getByTestId('stin-file').attachFile('../fixtures/w3-dummy.pdf');
  cy.getByTestId('stin-file-label').should('have.class', 'validated');
  cy.getByTestId('complete-step-1').click();
  cy.getByTestId('petition-file-label').should('not.have.class', 'validated');
  cy.getByTestId('petition-file').attachFile('../fixtures/w3-dummy.pdf');
  cy.getByTestId('petition-file-label').should('have.class', 'validated');
  cy.getByTestId('irs-notice-Yes').click();
  cy.getByTestId('case-type-select').select('Notice of Deficiency');
  cy.getByTestId('complete-step-2').click();
  cy.getByTestId('filing-type-1').click();
  cy.getByTestId('is-spouse-deceased-1').click();
  cy.getByTestId('modal-confirm').click();
  cy.getByTestId('contact-primary-name').type('John');
  cy.getByTestId('contact-secondary-name').type('Sally');
  cy.getByTestId('contactPrimary.address1').type('111 South West St.');
  cy.getByTestId('contactPrimary.city').type('Orlando');
  cy.getByTestId('contactPrimary.state').select('AL');
  cy.getByTestId('contactPrimary.postalCode').type('12345');
  cy.getByTestId('phone').type('1111111111');
  cy.getByTestId('use-same-address-above-label').click();
  cy.getByTestId('complete-step-3').click();
  cy.getByTestId('procedure-type-1').click();
  cy.getByTestId('procedure-type-0').click();
  cy.getByTestId('preferred-trial-city').select('Mobile, Alabama');
  cy.getByTestId('complete-step-4').click();
  cy.getByTestId('file-petition').click();
  return cy
    .getByTestId('docket-number-with-suffix')
    .invoke('text')
    .then(docketNumberWithSuffix => {
      cy.getByTestId('button-back-to-dashboard').click();
      return cy.wrap<string>(docketNumberWithSuffix);
    });

  // cy.intercept('POST', '**/cases').as('postCase');

  // cy.getByTestId(`case-link-${docketNumber}`).click()
  // return cy.wait('@postCase').then(({ response }) => {
  //   expect(response?.body).to.have.property('docketNumber');
  //   const docketNumber = response?.body.docketNumber;
  //   cy.url().should('include', 'file-a-petition/success');
  //   cy.getByTestId('button-back-to-dashboard').click();
  //   cy.getByTestId(`case-link-${docketNumber}`).should(
  //     'contain.text',
  //     docketNumber,
  //   );
  //   return cy.wrap<string>(docketNumber);
  // });
}
