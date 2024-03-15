import { Then } from '@badeball/cypress-cucumber-preprocessor';
import { cypressState } from '../../../state';

Then('I should see an NOCE has been served on my case', () => {
  const { currentUser, docketNumber } = cypressState;

  cy.get('[data-testid="my-cases-link"]');
  cy.task('waitForNoce', { docketNumber }).then(isNOCECreated => {
    expect(isNOCECreated).to.equal(
      true,
      'NOCE was not generated on a case that a practitioner was granted e-access for.',
    );
  });
  cy.get(`[data-testid="${docketNumber}"]`).contains(docketNumber).click();
  cy.get('tbody:contains(NOCE)').should('exist');

  cy.get('[data-testid="tab-case-information"]').click();
  cy.get('[data-testid="tab-parties"]').click();
  cy.get('[data-testid="petitioner-email"]').should(
    'contain',
    currentUser.email,
  );
  cy.get('[data-testid="petitioner-pending-email"]').should('not.contain.text');
  cy.get('[data-testid="account-menu-button"]').click();
  cy.get('[data-testid="my-account-link"]').click();
  cy.get('[data-testid="user-service-email"]').should(
    'contain',
    currentUser.email,
  );
});
