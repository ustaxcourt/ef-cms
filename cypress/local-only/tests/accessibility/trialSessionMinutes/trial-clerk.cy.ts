import { checkA11y } from '../../../support/generalCommands/checkA11y';
import { loginAsTrialClerk } from '../../../../helpers/authentication/login-as-helpers';

describe('Trial Sessions Page - Petitions Clerk Accessibility', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  it('should be free of a11y issues', () => {
    loginAsTrialClerk();
    cy.visit(
      '/trial-session-detail/959c4338-0fac-42eb-b0eb-d53b8d0195cc/case/101-20/minutes',
    );
    cy.get('[data-testid="trial-session-minutes-page"]').should('exist');

    checkA11y();
  });
});
