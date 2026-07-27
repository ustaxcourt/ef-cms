import { checkA11y } from '../../../support/generalCommands/checkA11y';
import { loginAsPetitionsClerk1 } from '../../../../helpers/authentication/login-as-helpers';

const NEW_TRIAL_CITY_OPTIONS = [
  'Austin, Texas',
  'Charlotte, North Carolina',
  'Newark, New Jersey',
  'Orlando, Florida',
  'Sacramento, California',
];

// Local Cypress runs seed the `new-trial-cities-enabled` feature flag to `true`
// via web-api/src/persistence/postgres/utils/seed/fixtures/featureFlags.ts, so
// the DAW-10170 trial-city options must be visible here.
describe('DAW-10170 - new trial-city locations appear in trial-session dropdowns', () => {
  it('lists every DAW-10170 location as a <select> option on the create-trial-session form (petitions clerk)', () => {
    loginAsPetitionsClerk1();
    cy.get('[data-testid="trial-session-link"]').click();
    cy.get('[data-testid="add-trial-session-button"]').click();

    NEW_TRIAL_CITY_OPTIONS.forEach(location => {
      cy.get('[data-testid="trial-session-trial-location"]')
        .find(`option[value="${location}"]`)
        .should('have.length', 1);
    });

    // Section 508 / WCAG 2.1 AA sweep of the create-trial-session form now
    // that the DAW-10170 options have been rendered into it.
    checkA11y();
  });
});
