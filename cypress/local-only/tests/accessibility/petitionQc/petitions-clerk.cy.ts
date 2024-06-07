import { loginAsPetitionsClerk } from '../../../../helpers/authentication/login-as-helpers';

describe('Petition QC - Petitions Clerk Accessibility', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  describe('Parties tab', () => {
    it('should be free of a11y issues', () => {
      loginAsPetitionsClerk();

      cy.visit('/case-detail/104-19/petition-qc?tab=partyInfo');
      cy.contains('Petition').should('exist');

      cy.runA11y();
    });
  });

  describe('Case info tab', () => {
    it('should be free of a11y issues', () => {
      loginAsPetitionsClerk();

      cy.visit('/case-detail/104-19/petition-qc?tab=caseInfo');
      cy.contains('Petition').should('exist');

      cy.runA11y();
    });
  });

  describe('IRS notice tab', () => {
    it('should be free of a11y issues', () => {
      loginAsPetitionsClerk();

      cy.visit('/case-detail/102-19/petition-qc?tab=irsNotice');
      cy.contains('Petition').should('exist');
      cy.get('#has-irs-verified-notice-yes').click();
      cy.get('#date-of-notice-picker').should('exist');

      cy.runA11y();
    });
  });
});
