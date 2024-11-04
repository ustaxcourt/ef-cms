import { checkA11y } from '../../../../support/generalCommands/checkA11y';

describe('Trial Session Details - Public Accessibility', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  it('should be free of a11y issues', () => {
    cy.visit('/trial-session-detail/959c4338-0fac-42eb-b0eb-d53b8d0195cc');
    cy.get('[data-testid="public-open-cases"]').click();

    checkA11y();
  });
});
