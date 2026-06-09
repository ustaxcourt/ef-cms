import { selectTypeaheadInput } from '../../../../../helpers/components/typeAhead/select-typeahead-input';

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
    selectTypeaheadInput('sessionTypes-filter-select', SESSION_TYPE);
    cy.get(`[data-testid="sessionTypes-${SESSION_TYPE}-pill-button"]`);

    const LOCATION = 'Mobile, Alabama';
    selectTypeaheadInput('locations-filter-select', LOCATION);
    cy.get(`[data-testid="locations-${LOCATION}-pill-button"]`);

    const JUDGE = 'Buch';
    selectTypeaheadInput('judges-filter-select', JUDGE);
    cy.get(`[data-testid="judges-${JUDGE}-pill-button"]`);

    cy.get(`[data-testid="sessionTypes-${SESSION_TYPE}-pill-button"]`)
      .find('button')
      .click();
    cy.get(`[data-testid="sessionTypes-${SESSION_TYPE}-pill-button"]`).should(
      'not.exist',
    );

    cy.get(`[data-testid="locations-${LOCATION}-pill-button"]`)
      .find('button')
      .click();
    cy.get(`[data-testid="locations-${LOCATION}-pill-button"]`).should(
      'not.exist',
    );

    cy.get(`[data-testid="judges-${JUDGE}-pill-button"]`)
      .find('button')
      .click();
    cy.get(`[data-testid="judges-${JUDGE}-pill-button"]`).should('not.exist');
  });

  it('should render the location pill for cities containing a period without crashing the page', () => {
    const LOCATION = 'St. Louis, Missouri';
    selectTypeaheadInput('locations-filter-select', LOCATION);

    cy.get(`[data-testid="locations-${LOCATION}-pill-button"]`).should('exist');
    // The page should still be rendered (not a blank white screen) after selecting
    // a city whose name contains a "." (e.g. St. Louis, St. Paul).
    cy.get('[data-testid="location-filter"]').should('be.visible');

    cy.get(`[data-testid="locations-${LOCATION}-pill-button"]`)
      .find('button')
      .click();
    cy.get(`[data-testid="locations-${LOCATION}-pill-button"]`).should(
      'not.exist',
    );
  });

  it('should apply and remove St. Louis, Missouri location filter on mobile', () => {
    const LOCATION = 'St. Louis, Missouri';

    cy.viewport('iphone-xr');
    cy.visit('/trial-sessions');

    cy.contains('button', 'Filters').click();
    cy.get('select[name="locations"]').select(LOCATION);

    cy.contains('span.blue-pill', LOCATION).should('exist');
    cy.get(`button[aria-label="remove ${LOCATION} selection"]`).click();
    cy.contains('span.blue-pill', LOCATION).should('not.exist');

    cy.get('select[name="locations"]').should('exist');
  });
});
