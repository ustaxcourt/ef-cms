import { checkA11y } from '../../../support/generalCommands/checkA11y';
import { loginAsIrsPractitioner } from '../../../../helpers/authentication/login-as-helpers';

describe('Case Search No Matches - Irs Practitioner Accessibility', () => {
  it('should be free of a11y issues', () => {
    loginAsIrsPractitioner();

    cy.visit('/search/no-matches');
    cy.get('[data-testid="header-text"]').should('contain', 'Search Results');

    checkA11y();
  });
});
