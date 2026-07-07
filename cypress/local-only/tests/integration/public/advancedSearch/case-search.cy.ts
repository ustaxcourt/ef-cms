import { faker } from '@faker-js/faker';
import { loginAsDocketClerk1 } from 'cypress/helpers/authentication/login-as-helpers';
import { goToCase } from 'cypress/helpers/caseDetail/go-to-case';
import {
  createAndServePaperPetition,
  createAndServePaperPetitionMyselfAndSpouse,
} from 'cypress/helpers/fileAPetition/create-and-serve-paper-petition';
import { assertExists, retry } from 'cypress/helpers/retry';
import { navigateToDashboard } from 'cypress/local-only/support/pages/maintenance';
import { searchForCaseByDocketNumber } from 'cypress/local-only/support/pages/public/advanced-search';
import { logout } from '../../../../../helpers/authentication/logout';

// 103 cases -> 2 pages (100 on page 1, 3 on page 2).
const TOTAL_PAGINATION_CASES = 103;
const paginationMockCases = Array.from(
  { length: TOTAL_PAGINATION_CASES },
  (_, index) => ({
    caseCaption: `Pagination Case ${index + 1}, Petitioner`,
    docketNumber: `${20000 + index + 1}-26`,
    docketNumberWithSuffix: `${20000 + index + 1}-26`,
    petitionerNames: [`Pagination Petitioner ${index + 1}`],
    petitionerStateNames: ['California'],
    receivedAt: `2026-06-${String((index % 28) + 1).padStart(2, '0')}T12:00:00.000Z`,
  }),
);

describe('Case Search', () => {
  describe('Case Search By Name', () => {
    it('should show public search boilerplate text', () => {
      cy.visit('/');
      cy.contains(
        'li',
        'If you aren’t affiliated with a case, you will only see limited information about that case.',
      ).should('be.visible');
      cy.contains(
        'li',
        'Sealed cases and affiliated documents will not display in search results.',
      ).should('be.visible');
    });

    it('should show order search results by [petitioner name, secondary contact name, case caption] when searching', () => {
      const nameToSearchFor = `${faker.person.firstName()} ${faker.person.lastName()}`;
      createAndServePaperPetition({ name: nameToSearchFor }).then(
        ({ docketNumber: primaryContactDocketNumber }) => {
          createAndServePaperPetitionMyselfAndSpouse({
            secondaryContactName: nameToSearchFor,
          }).then(({ docketNumber: secondaryContactDocketNumber }) => {
            createAndServePaperPetition().then(
              ({ docketNumber: caseCaptionDocketNumber }) => {
                const updatedCaseCaption = `${nameToSearchFor}, name on caseCaption, third-best match, Petitioner`;
                loginAsDocketClerk1();
                goToCase(caseCaptionDocketNumber);
                cy.get('[data-testid=tab-case-information]').click();
                cy.get('[data-testid=menu-edit-case-context-button]').click();
                cy.get('[data-testid=edit-case-caption-textarea]').clear();
                cy.get('[data-testid=edit-case-caption-textarea]').type(
                  updatedCaseCaption,
                );
                cy.get('[data-testid="modal-button-confirm"]').click();
                cy.get('[data-testid="success-alert"]').should('be.visible');

                cy.visit('/');
                cy.get('[data-testid=petitioner-name]').type(nameToSearchFor);
                cy.get(
                  '[data-testid=submit-case-search-by-name-button]',
                ).click();

                cy.get(
                  //7355: Primary contact Name is most important
                  `[data-testid=advanced-case-search-result-${primaryContactDocketNumber}]`,
                ).find(`[data-testid=advanced-case-search-result-order-${0}]`);
                cy.get(
                  //7355: Secondary contact name is second most important
                  `[data-testid=advanced-case-search-result-${secondaryContactDocketNumber}]`,
                ).find(`[data-testid=advanced-case-search-result-order-${1}]`);
                cy.get(
                  //7355: Case caption is third most important
                  `[data-testid=advanced-case-search-result-${caseCaptionDocketNumber}]`,
                ).find(`[data-testid=advanced-case-search-result-order-${2}]`);
              },
            );
          });
        },
      );
    });

    it('should show whole first name and last name matches for petitioner name and secondary contact', () => {
      const primaryFirstName = faker.person.firstName();
      const primaryName = `${primaryFirstName} Rogers`;
      const secondaryLastName = faker.person.lastName();
      const secondaryName = `Terrance ${secondaryLastName}`;

      createAndServePaperPetitionMyselfAndSpouse({
        secondaryContactName: secondaryName,
        primaryContactName: primaryName,
      }).then(({ docketNumber }) => {
        logout();
        cy.visit('/');
        retry(() => {
          cy.get('[data-testid=petitioner-name]').clear();
          cy.get('[data-testid=petitioner-name]').type(primaryFirstName);
          cy.get('[data-testid=submit-case-search-by-name-button]').click();
          return assertExists(
            `[data-testid=advanced-case-search-result-${docketNumber}]`,
          );
        });

        retry(() => {
          cy.get('[data-testid=petitioner-name]').clear();
          cy.get('[data-testid=petitioner-name]').type(secondaryLastName);
          cy.get('[data-testid=submit-case-search-by-name-button]').click();
          return assertExists(
            `[data-testid=advanced-case-search-result-${docketNumber}]`,
          );
        });
      });
    });

    it('should show no matches when searching for names that do not exist', () => {
      const searchTerm = 'ZeroMatches DoNotMatchThis';

      cy.visit('/');
      cy.get('[data-testid=petitioner-name]').clear();
      cy.get('[data-testid=petitioner-name]').type(searchTerm);
      cy.get('[data-testid=submit-case-search-by-name-button]').click();
      cy.get('[data-testid=no-search-results]');
    });

    describe('Case Search By Name - Pagination', () => {
      beforeEach(() => {
        cy.intercept('GET', '/public-api/search?**', {
          body: {
            results: paginationMockCases,
          },
        }).as('getCaseSearchResults');

        cy.visit('/');
        cy.get('[data-testid=petitioner-name]').type('Pagination Petitioner');
        cy.get('[data-testid=submit-case-search-by-name-button]').click();
        cy.wait('@getCaseSearchResults');
        cy.get('table.search-results').should('be.visible');
      });

      it('should show the paginator when results span more than one page', () => {
        cy.get('[data-testid="paginator-page-1"]').first().should('exist');
        cy.get('[data-testid="paginator-page-2"]').first().should('exist');
      });

      it('should display page 1 with 100 rows and page 1 highlighted', () => {
        cy.get('tr.search-result').should('have.length', 100);
        cy.get('[data-testid="paginator-page-1"]')
          .first()
          .should('have.class', 'paginator-current');
        cy.get('tr.search-result')
          .first()
          .should(
            'have.attr',
            'data-testid',
            `advanced-case-search-result-${paginationMockCases[0].docketNumber}`,
          );
      });

      it('should navigate to page 2 and show the remaining 3 rows', () => {
        cy.get('[data-testid="paginator-page-2"]').first().click();

        cy.get('tr.search-result').should('have.length', 3);
        cy.get('[data-testid="paginator-page-2"]')
          .first()
          .should('have.class', 'paginator-current');
        cy.get('tr.search-result')
          .first()
          .should(
            'have.attr',
            'data-testid',
            `advanced-case-search-result-${paginationMockCases[100].docketNumber}`,
          );
      });

      it('should navigate forward via the Next button', () => {
        cy.get('[aria-label="Next page"]').first().click();

        cy.get('[data-testid="paginator-page-2"]')
          .first()
          .should('have.class', 'paginator-current');
        cy.get('tr.search-result').should('have.length', 3);
      });

      it('should navigate back to page 1 via the Previous button', () => {
        cy.get('[data-testid="paginator-page-2"]').first().click();
        cy.get('[aria-label="Previous page"]').first().click();

        cy.get('[data-testid="paginator-page-1"]')
          .first()
          .should('have.class', 'paginator-current');
        cy.get('tr.search-result').should('have.length', 100);
      });

      it('should display the total case count', () => {
        cy.contains('span', 'Count:').should(
          'have.attr',
          'title',
          'Search is limited to 5,000 results.',
        );
        cy.contains(TOTAL_PAGINATION_CASES.toLocaleString()).should('exist');
      });

      it('should reset to page 1 when the sort column changes', () => {
        cy.get('[data-testid="paginator-page-2"]').first().click();
        cy.get('[data-testid="paginator-page-2"]')
          .first()
          .should('have.class', 'paginator-current');

        cy.contains('button', 'Docket No.').click();

        cy.get('[data-testid="paginator-page-1"]')
          .first()
          .should('have.class', 'paginator-current');
        cy.get('tr.search-result').should('have.length', 100);
      });
    });
  });

  describe('Case Search - by docket number', () => {
    it('should display "No Matches Found" when case search yields no results', () => {
      navigateToDashboard();
      searchForCaseByDocketNumber('999-99');
      cy.get('div#no-search-results');
    });

    it('should route to case detail when a case search match is found', () => {
      navigateToDashboard();
      searchForCaseByDocketNumber('103-20');
      cy.get('table#docket-record-table');
    });

    it('should route to case detail when a case search match is found by hitting enter', () => {
      navigateToDashboard();
      cy.get('input#docket-number').type('103-20');
      cy.get('input#docket-number').type('{enter}');
      cy.get('table#docket-record-table');
    });
  });
});
