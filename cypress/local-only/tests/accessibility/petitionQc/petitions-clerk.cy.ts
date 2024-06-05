import { impactLevel } from '../../../../helpers/accessibility-impact';
import { loginAsPetitionsClerk } from '../../../../helpers/authentication/login-as-helpers';
import { terminalLog } from '../../../../helpers/cypressTasks/logs';

describe('Petition QC - Petitions Clerk Accessibility', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  describe('Parties tab', () => {
    it('should be free of a11y issues', () => {
      loginAsPetitionsClerk();

      cy.visit('/case-detail/104-19/petition-qc?tab=partyInfo');
      cy.contains('Petition').should('exist');

      cy.injectAxe();

      cy.checkA11y(
        undefined,
        {
          includedImpacts: impactLevel,
          rules: {
            'nested-interactive': { enabled: false }, // https://github.com/flexion/ef-cms/issues/10396
          },
        },
        terminalLog,
      );
    });
  });

  describe('Case info tab', () => {
    it('should be free of a11y issues', () => {
      loginAsPetitionsClerk();

      cy.visit('/case-detail/104-19/petition-qc?tab=caseInfo');
      cy.contains('Petition').should('exist');

      cy.injectAxe();

      cy.checkA11y(
        undefined,
        {
          includedImpacts: impactLevel,
          rules: {
            'nested-interactive': { enabled: false }, // https://github.com/flexion/ef-cms/issues/10396
          },
        },
        terminalLog,
      );
    });
  });

  describe('IRS notice tab', () => {
    it('should be free of a11y issues', () => {
      loginAsPetitionsClerk();

      cy.visit('/case-detail/102-19/petition-qc?tab=irsNotice');
      cy.contains('Petition').should('exist');
      cy.get('#has-irs-verified-notice-yes').click();
      cy.get('#date-of-notice-picker').should('exist');

      cy.injectAxe();

      cy.checkA11y(
        undefined,
        {
          includedImpacts: impactLevel,
          rules: {
            'nested-interactive': { enabled: false }, // https://github.com/flexion/ef-cms/issues/10396
          },
        },
        terminalLog,
      );
    });
  });
});
