import { loginAsAdmissionsClerk } from 'cypress/helpers/authentication/login-as-helpers';
import { createAPractitioner } from 'cypress/helpers/accountCreation/create-a-practitioner';
import { selectTypeaheadInput } from 'cypress/helpers/components/typeAhead/select-typeahead-input';
import { assertExists, retry } from 'cypress/helpers/retry';
import { checkA11y } from 'cypress/local-only/support/generalCommands/checkA11y';

describe('Practitioner Search', () => {
  ['FRED', 'K', 'PT0000'].forEach(invalidBarNumber => {
    it(`should show no matches when an internal user searches by bar number "${invalidBarNumber}"`, () => {
      loginAsAdmissionsClerk();
      cy.get('[data-testid="search-link"]').click();
      cy.get('[data-testid="practitioner-search-tab"]').click();
      cy.get('[data-testid="bar-number-search-input"]').type(invalidBarNumber);
      cy.get(
        '[data-testid="practitioner-search-by-bar-number-button"]',
      ).click();
      cy.get('[data-testid="no-search-results"]').should('be.visible');
      checkA11y();
    });
  });

  it('should return practitioner results when the user filters by original bar state', () => {
    loginAsAdmissionsClerk();
    createAPractitioner({ originalBarState: 'New Jersey' }).then(
      ({ barNumber, firstName, originalBarState }) => {
        cy.get('[data-testid="search-link"]').click();
        cy.get('[data-testid="practitioner-search-tab"]').click();
        cy.get('[data-testid="practitioner-name-input"]').type(firstName);
        selectTypeaheadInput('original-bar-state-filter', originalBarState);

        retry(() => {
          cy.get('[data-testid="practitioner-search-by-name-button"]').click();
          return assertExists(`[data-testid="practitioner-row-${barNumber}"]`);
        });

        cy.get(`[data-testid="practitioner-row-${barNumber}"]`).should(
          'contain',
          originalBarState,
        );
        cy.get(`[data-testid="bar-state-pill-NJ"]`).click();
        selectTypeaheadInput('original-bar-state-filter', 'New York');
        cy.get('[data-testid="practitioner-search-by-name-button"]').click();
        cy.get(`[data-testid="practitioner-row-${barNumber}"]`).should(
          'not.exist',
        );
      },
    );
  });

  it('should return practitioner results when the user filters by practitioner type', () => {
    loginAsAdmissionsClerk();
    createAPractitioner().then(({ barNumber, firstName }) => {
      cy.get('[data-testid="search-link"]').click();
      cy.get('[data-testid="practitioner-search-tab"]').click();
      cy.get('[data-testid="practitioner-name-input"]').type(firstName);
      cy.get('[data-testid="practitioner-type-Attorney-radio"]').click();

      retry(() => {
        cy.get('[data-testid="practitioner-search-by-name-button"]').click();
        return assertExists(`[data-testid="practitioner-row-${barNumber}"]`);
      });

      cy.get(`[data-testid="practitioner-row-${barNumber}"]`).should(
        'contain',
        'Attorney',
      );

      cy.get('[data-testid="practitioner-type-Non-Attorney-radio"]').click();
      cy.get('[data-testid="practitioner-search-by-name-button"]').click();
      cy.get(`[data-testid="practitioner-row-${barNumber}"]`).should(
        'not.exist',
      );
    });
  });

  it('should return practitioner results when the user filters by practice type', () => {
    loginAsAdmissionsClerk();
    createAPractitioner().then(({ barNumber, firstName }) => {
      cy.get('[data-testid="search-link"]').click();
      cy.get('[data-testid="practitioner-search-tab"]').click();
      cy.get('[data-testid="practitioner-name-input"]').type(firstName);
      cy.get('[data-testid="practice-type-IRS').click();

      retry(() => {
        cy.get('[data-testid="practitioner-search-by-name-button"]').click();
        return assertExists(`[data-testid="practitioner-row-${barNumber}"]`);
      });

      cy.get(`[data-testid="practitioner-row-${barNumber}"]`).should(
        'contain',
        'IRS',
      );

      cy.get('[data-testid="practice-type-IRS').click();
      cy.get('[data-testid="practice-type-DOJ').click();
      cy.get('[data-testid="practitioner-search-by-name-button"]').click();
      cy.get(`[data-testid="practitioner-row-${barNumber}"]`).should(
        'not.exist',
      );
    });
  });

  it('should return practitioner results when the user filters by admission status', () => {
    loginAsAdmissionsClerk();
    createAPractitioner().then(({ barNumber, firstName }) => {
      cy.get('[data-testid="search-link"]').click();
      cy.get('[data-testid="practitioner-search-tab"]').click();
      cy.get('[data-testid="practitioner-name-input"]').type(firstName);
      selectTypeaheadInput('admission-status-filter', 'Active');

      retry(() => {
        cy.get('[data-testid="practitioner-search-by-name-button"]').click();
        return assertExists(`[data-testid="practitioner-row-${barNumber}"]`);
      });

      cy.get(`[data-testid="practitioner-row-${barNumber}"]`).should(
        'contain',
        'Active',
      );

      cy.get(`[data-testid="admission-status-pill-Active"]`).click();
      selectTypeaheadInput('admission-status-filter', 'Suspended');
      cy.get('[data-testid="practitioner-search-by-name-button"]').click();
      cy.get(`[data-testid="practitioner-row-${barNumber}"]`).should(
        'not.exist',
      );
    });
  });
});
