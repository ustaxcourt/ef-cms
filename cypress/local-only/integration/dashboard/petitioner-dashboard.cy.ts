import { navigateTo as loginAs } from '../../support/pages/maintenance';
import { petitionerCreatesElectronicCase } from '../../../helpers/fileAPetition/petitioner-creates-electronic-case';

describe('Petitioner views dashboard', () => {
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
    loginAs('petitioner');
    cy.get('[data-testid="case-list-table"]');
    cy.get('[data-testid="filing-fee"]');
    petitionerCreatesElectronicCase().then(docketNumber => {
      cy.get('[data-testid="filing-fee"]');
      cy.get(`[data-testid="${docketNumber}"]`)
        .find('[data-testid="petition-payment-status"]')
        .should('have.text', 'Not paid');
    });
  });
});
