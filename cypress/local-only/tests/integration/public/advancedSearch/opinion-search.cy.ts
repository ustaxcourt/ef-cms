import { navigateToDashboard } from 'cypress/local-only/support/pages/maintenance';
import {
  enterDocumentKeywordForAdvancedSearch,
  enterDocumentDocketNumber,
  searchForDocuments,
  unselectOpinionTypesExceptBench,
} from 'cypress/local-only/support/pages/public/advanced-search';

describe('Opinion Search', () => {
  it('should display results when a keyword and docketNumberWithSuffix is provided', () => {
    navigateToDashboard();
    cy.get('[data-testid="opinion-search-tab"]').click();
    enterDocumentKeywordForAdvancedSearch('opinion');
    enterDocumentDocketNumber('124-20L');
    searchForDocuments();
    cy.get('table.search-results');
  });

  it('should display results with a judge name', () => {
    navigateToDashboard();
    cy.get('[data-testid="opinion-search-tab"]').click();
    enterDocumentDocketNumber('107-19');

    unselectOpinionTypesExceptBench();
    searchForDocuments();

    cy.get('table.search-results');
    cy.contains('td', 'Foley');
  });
});
