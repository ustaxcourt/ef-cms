import { selectTypeaheadInput } from '../../../helpers/components/typeAhead/select-typeahead-input';

describe('Public Trial Sessions', () => {
  beforeEach(() => {
    cy.visit('/trial-sessions');
  });

  it('should display table filters correctly', () => {
    cy.get('[data-testid="proceeding-type-filter"]').should('be.visible');
    cy.get('[data-testid="session-type-filter"]').should('be.visible');
    cy.get('[data-testid="location-filter"]').should('be.visible');
    cy.get('[data-testid="judge-filter"]').should('be.visible');

    cy.get('[data-testid="remote-proceedings-card"]').should('be.visible');
    cy.get('[data-testid="remote-proceedings-card"]')
      .find('a')
      .should('have.length', 2);

    cy.get('[data-testid="trial-sessions-reset-filters-button"]').should(
      'be.disabled',
    );
  });

  it('should enable the reset filters button if there are any filters aplied', () => {
    cy.get('[data-testid="trial-sessions-reset-filters-button"]').should(
      'be.disabled',
    );

    cy.get('[data-testid="In Person-proceeding-label"]').click();

    cy.get('[data-testid="trial-sessions-reset-filters-button"]').should(
      'be.enabled',
    );
  });

  it('should display Pill Button for every dropdown filter selected', () => {
    const SESSION_TYPE = 'Regular';
    selectTypeaheadInput('session-type-filter-select', SESSION_TYPE);
    cy.get(`[data-testid="session-${SESSION_TYPE}-pill-button"]`);

    const LOCATION = 'Mobile, Alabama';
    selectTypeaheadInput('location-filter-search', LOCATION);
    cy.get(`[data-testid="location-${LOCATION}-pill-button"]`);

    const JUDGE = 'Buch';
    selectTypeaheadInput('judge-filter-search', JUDGE);
    cy.get(`[data-testid="judge-${JUDGE}-pill-button"]`);

    cy.get(`[data-testid="session-${SESSION_TYPE}-pill-button"]`)
      .find('button')
      .click();
    cy.get(`[data-testid="session-${SESSION_TYPE}-pill-button"]`).should(
      'not.exist',
    );

    cy.get(`[data-testid="location-${LOCATION}-pill-button"]`)
      .find('button')
      .click();
    cy.get(`[data-testid="location-${LOCATION}-pill-button"]`).should(
      'not.exist',
    );

    cy.get(`[data-testid="judge-${JUDGE}-pill-button"]`).find('button').click();
    cy.get(`[data-testid="judge-${JUDGE}-pill-button"]`).should('not.exist');
  });
});
