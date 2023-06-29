import {
  navigateTo as navigateToDashboard,
  petitionHyperlink,
  publicHeader,
  searchForCaseByDocketNumber,
} from '../../support/pages/public/advanced-search';

describe('Terminal user', () => {
  after(() => {
    cy.task('setAllowedTerminalIpAddresses', []);
  });

  it('should display terminal user header when ip is on allow list', () => {
    cy.task('setAllowedTerminalIpAddresses', ['localhost']).then(() => {
      navigateToDashboard();
      publicHeader().should('contain', 'US Tax Court Terminal');

      searchForCaseByDocketNumber('104-20');
      petitionHyperlink().should('exist');
    });
  });

  it('should be able to open publicly available case documents in a new tab', () => {
    cy.task('setAllowedTerminalIpAddresses', ['localhost']).then(() => {
      navigateToDashboard();

      cy.visit('/case-detail/104-20').then(window => {
        cy.stub(window, 'open').as('windowOpen');
      });

      cy.get('.view-pdf-link').first().click();

      cy.get('@windowOpen').should('have.been.called');
    });
  });
});
