import { loginAsPrivatePractitioner } from '../../../helpers/authentication/login-as-helpers';
import { practitionerCreatesElectronicCase } from '../../../helpers/fileAPetition/practitioner-creates-electronic-case';

describe('Private practitioner views dashboard', () => {
  before(() => {
    cy.task('toggleFeatureFlag', {
      flag: 'updated-petition-flow',
      flagValue: false,
    });

    cy.reload(true);
  });

  after(() => {
    cy.task('toggleFeatureFlag', {
      flag: 'updated-petition-flow',
      flagValue: true,
    });
  });

  it('should display filing fee column', () => {
    loginAsPrivatePractitioner();
    practitionerCreatesElectronicCase().then(docketNumber => {
      cy.get('[data-testid="case-list-table"]');
      cy.get('[data-testid="filing-fee"]');

      cy.get('[data-testid="filing-fee"]');
      cy.get(`[data-testid="${docketNumber}"]`)
        .find('[data-testid="petition-payment-status"]')
        .should('have.text', 'Not paid');
    });
  });
});
