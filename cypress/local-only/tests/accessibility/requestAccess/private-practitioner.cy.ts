/* eslint-disable jest/no-disabled-tests */

import { checkA11y } from '../../../support/generalCommands/checkA11y';
import { loginAsPrivatePractitioner } from '../../../../helpers/authentication/login-as-helpers';

describe('Request Case Access Page - Private Practitioner Accessibility', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  it('should be free of a11y issues', () => {
    loginAsPrivatePractitioner();

    cy.visit('/case-detail/102-19/case-association-request');
    cy.get('[data-testid="request-access-submit-document"]').should('exist');
    checkA11y();
  });

  it('should be free of a11y issues when requesting access with supporting document', () => {
    loginAsPrivatePractitioner();

    cy.visit('/case-detail/102-19/case-association-request');
    cy.get('[data-testid="request-access-submit-document"]').should('exist');
    cy.get('[data-testid="document-type"]').click();
    cy.get('[data-testid="document-type"]').type(
      'Motion to Substitute Parties and Change Caption{enter}',
    );
    cy.get('#add-supporting-document-button').click();
    cy.get('#supporting-document-0').select('Affidavit in Support');
    cy.get('#supportingDocuments-0-certificateOfService').click({
      force: true,
    });
    cy.get('#supportingDocuments-0-service-date-picker').should('exist');

    checkA11y();
  });
});
