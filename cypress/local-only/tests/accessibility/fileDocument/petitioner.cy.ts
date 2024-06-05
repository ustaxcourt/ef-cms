import { impactLevel } from '../../../../helpers/accessibility-impact';
import { loginAsPetitioner } from '../../../../helpers/authentication/login-as-helpers';
import { terminalLog } from '../../../../helpers/cypressTasks/logs';

describe('File Document Page - Petitioner Accessibility', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  it('should be free of a11y issues', () => {
    loginAsPetitioner();
    cy.visit('/case-detail/101-19/file-a-document');
    cy.get('#document-type').should('exist');

    cy.injectAxe();

    cy.checkA11y(
      undefined,
      {
        includedImpacts: impactLevel,
        rules: {
          'color-contrast': { enabled: false }, // Ignore contrast as it's good enough for now
          'nested-interactive': { enabled: false }, // https://github.com/flexion/ef-cms/issues/10396
        },
      },
      terminalLog,
    );
  });

  it('should be free of a11y issues on step 2', () => {
    loginAsPetitioner();
    cy.visit('/case-detail/101-19/file-a-document');
    cy.get('#document-type').click({ force: true });
    cy.get('#document-type input')
      .first()
      .type('Motion for Leave to File Out of Time');
    cy.get('#document-type #react-select-2-option-0').click({ force: true });
    cy.get('#secondary-doc-secondary-document-type').click({ force: true });
    cy.get('#secondary-doc-secondary-document-type input')
      .first()
      .type('Motion for Continuance');
    cy.get(
      '#secondary-doc-secondary-document-type #react-select-3-option-0',
    ).click({ force: true });
    cy.get('#submit-document').click();
    cy.get('#primaryDocument-certificateOfService-label').click();
    cy.get('#primaryDocument-service-date-picker').should('exist');

    cy.injectAxe();

    cy.checkA11y(
      undefined,
      {
        includedImpacts: impactLevel,
        rules: {
          'color-contrast': { enabled: false }, // Ignore contrast as it's good enough for now
          'nested-interactive': { enabled: false }, // https://github.com/flexion/ef-cms/issues/10396
        },
      },
      terminalLog,
    );
  });
});
