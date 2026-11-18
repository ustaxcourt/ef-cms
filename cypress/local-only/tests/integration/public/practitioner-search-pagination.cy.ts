import { checkA11y } from 'cypress/local-only/support/generalCommands/checkA11y';

describe('Public Practitioner Search Pagination', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('[data-testid="tabs-menu"]').find('li').eq(3).click();
  });

  it('preserves null values in the cursor when moving to the next page', () => {
    const cursor = [null, 'smith', 'SB1234'];
    const searchResponse = {
      searchResults: {
        lastKey: cursor,
        practitioners: [
          {
            admissionsDate: '2000-01-01',
            admissionsStatus: 'Active',
            barNumber: 'SB1234',
            entityName: 'PublicContact',
            name: 'Smith Practitioner',
            originalBarState: 'CA',
            practiceType: 'Private',
            practitionerType: 'Attorney',
          },
        ],
        total: 101,
      },
    };
    let requestCount = 0;

    cy.intercept('GET', '/public-api/practitioners*', request => {
      requestCount += 1;
      expect(request.query.searchAfter).to.equal(
        requestCount === 1 ? undefined : JSON.stringify(cursor),
      );
      request.reply({ body: searchResponse });
    }).as('practitionerSearchWithCursor');

    cy.get('input#practitioner-name').type('smith');
    cy.get('button#practitioner-search-by-name-button').click();
    cy.wait('@practitionerSearchWithCursor');

    cy.get('button[aria-label="Next page"]').first().click();
    cy.wait('@practitionerSearchWithCursor');
    cy.get('[data-testid="practitioner-row-SB1234"]').should('be.visible');
    checkA11y();
  });
});
