import { navigateTo as loginAs } from '../support/pages/maintenance';
// import { petitionerCreatesACase } from '../support/setup/petitioner-creates-case';

describe('Petitioner views dashboard', () => {
  it('should display filing fee column', () => {
    loginAs('petitioner');
    cy.getByTestId('filing-fee');
    cy.getByTestId('102-22')
      .find('[data-testid="petition-payment-status"]')
      .should('have.text', 'Not paid');
    //   petitionerCreatesACase().then(docketNumber => {
    //     cy.getByTestId('filing-fee');
    //     cy.getByTestId(docketNumber)
    //       .getByTestId('petition-payment-status')
    //       .should('have.text', 'Not paid');
    //   });
  });
});
