/* eslint-disable quotes */
import { Then, When } from '@badeball/cypress-cucumber-preprocessor';
import { createAndServePaperPetition } from '../../../helpers/create-and-serve-paper-petition';

When(
  `I create and serve a paper petition + grant e-access for practitioner as {string}`,
  (email: string) => {
    createAndServePaperPetition().then(({ docketNumber }) => {
      cy.login('admissionsclerk1');
      cy.get('[data-testid="messages-banner"]');
      cy.get('[data-testid="docket-number-search-input"]').type(docketNumber);
      cy.get('[data-testid="search-docket-number"]').click();
      cy.get('[data-testid="tab-case-information"]').click();
      cy.get('[data-testid="tab-parties"]').click();
      cy.get('[data-testid="edit-petitioner-button"]').click();
      cy.get('[data-testid="internal-edit-petitioner-email-input"]').type(
        email,
      );
      cy.get('[data-testid="internal-confirm-petitioner-email-input"]').type(
        email,
      );
      cy.get(
        '[data-testid="submit-edit-petitioner-information-button"]',
      ).click();
      cy.get('[data-testid="modal-button-confirm"]').click();

      // cy.visit('/login');
      // cy.get('[data-testid="forgot-password-button"]').click();
      // cy.get('[data-testid="email-input"]').clear();
      // cy.get('[data-testid="email-input"]').type(practitionerEmail);
      // cy.get('[data-testid="send-password-reset-button"]').click();
      // cy.get('[data-testid="warning-alert"]').should(
      //   'contain',
      //   'We’ve sent you an email',
      // );
    });
  },
);

Then(
  'I should see an alert that my changes to the petition have been saved',
  () => {
    cy.get('[data-testid="success-alert"]').contains('Changes saved');
  },
);
