import { assertExists, retry } from '../../../helpers/retry';
import { attachFile } from '../../../helpers/file/upload-file';
import { createAPractitioner } from '../../../helpers/accountCreation/create-a-practitioner';
import { createAndServePaperPetition } from '../../../helpers/fileAPetition/create-and-serve-paper-petition';
import { faker } from '@faker-js/faker';
import { goToCase } from '../../../helpers/caseDetail/go-to-case';
import {
  loginAsAdmissionsClerk,
  loginAsDocketClerk1,
  loginAsPetitionsClerk1,
} from '../../../helpers/authentication/login-as-helpers';
import { selectTypeaheadInput } from '../../../helpers/components/typeAhead/select-typeahead-input';
import {
  ADVANCED_DOCUMENT_SEARCH_PAGE_SIZE,
  CASE_TYPES_MAP,
} from '@shared/business/entities/EntityConstants';
import { v4 } from 'uuid';
import { createOrderAndDecision } from '../../../helpers/caseDetail/docketRecord/courtIssuedFiling/create-order-and-decision';

describe('Advanced Search', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  it('should find a served paper case when the user searches by party name or docket number', () => {
    /** Arrange */
    createAndServePaperPetition({ includeApwDocument: false }).then(
      ({ docketNumber, name }) => {
        /** Act */
        cy.get('[data-testid="search-link"]').click();
        cy.get('[data-testid="petitioner-name"]').type(name);
        selectTypeaheadInput('case-type-selection', CASE_TYPES_MAP.cdp);

        /** Assert */
        // need to wait for elasticsearch potentially
        retry(() => {
          cy.get('[data-testid="submit-case-search-by-name-button"]').click();
          return assertExists(`[data-testid="case-result-${docketNumber}"]`);
        });
      },
    );
  });

  it('should return practitioner results when the user searches by name', () => {
    /** Arrange */
    loginAsAdmissionsClerk();
    const firstName = `${faker.person.firstName()}-${v4()}`;
    createAPractitioner({ firstName }).then(({ barNumber }) => {
      /** Act */
      cy.get('[data-testid="search-link"]').click();
      cy.get('[data-testid="practitioner-search-tab"]').click();
      cy.get('[data-testid="practitioner-name-input"]').type(firstName);

      /** Assert */
      retry(() => {
        cy.get('[data-testid="practitioner-search-by-name-button"]').click();
        return assertExists(`[data-testid="practitioner-row-${barNumber}"]`);
      });
      cy.get('[data-testid="practitioner-search-result-count"]').should(
        'exist',
      );
      cy.get('[data-testid="clear-practitioner-search"]').click();
      cy.get(`[data-testid="practitioner-row-${barNumber}"]`).should(
        'not.exist',
      );
    });
  });

  it('should return no results when the user searches for practitioner that does not exist', () => {
    /** Arrange */
    loginAsAdmissionsClerk();

    /** Act */
    cy.get('[data-testid="search-link"]').click();
    cy.get('[data-testid="practitioner-search-tab"]').click();
    cy.get('[data-testid="practitioner-name-input"]').type('doesNotExist');

    /** Assert */
    retry(() => {
      cy.get('[data-testid="practitioner-search-by-name-button"]').click();
      return assertExists('[data-testid="no-search-results"]');
    });
    cy.get('[data-testid="clear-practitioner-search"]').click();
    cy.get('[data-testid="no-search-results"]').should('not.exist');
  });

  it('should find a practitioner and route to the practitioner detail page when the user searches by bar number', () => {
    /** Arrange */
    loginAsAdmissionsClerk();
    createAPractitioner().then(({ barNumber }) => {
      /** Act */
      cy.get('[data-testid="search-link"]').click();
      cy.get('[data-testid="practitioner-search-tab"]').click();
      cy.get('[data-testid="bar-number-search-input"]').type(barNumber);
      cy.get(
        '[data-testid="practitioner-search-by-bar-number-button"]',
      ).click();

      /** Assert */
      cy.url().should('include', barNumber);
      cy.get('[data-testid="print-practitioner-case-list"]').click();
      cy.get('dialog.modal-screen').should('exist');
      cy.get('h3:contains("Printable Case List")').should('be.visible');
    });
  });

  it('should find matching results when the user searches for an order by keyword', () => {
    /** Arrange */
    loginAsPetitionsClerk1();
    createAndServePaperPetition({ includeApwDocument: false }).then(
      ({ docketNumber }) => {
        loginAsDocketClerk1();

        goToCase(docketNumber);

        // Jan 14th, 2026: NOTE: There's a weird bug with how OpenSearch indexs search keywords, you might
        // see searchResults assert fail not because the order doesn't exist, but because the search doesn't find it.
        // If this happens, rerun smoketests until it passes. (until we can figure out a fix)
        // Works like 'Plump Priest' get detected, but 'Plump Priesthood' does not.
        const orderContents = `${faker.word.adjective()} ${faker.word.noun()}`;

        // Connect to WebSocket to listen for serve_document_complete
        cy.window().then(win => {
          const token = win.localStorage.getItem('token');
          const clientConnectionId = `cypress-${v4()}`;
          cy.task('connectWebSocket', { token, clientConnectionId });
        });

        createOrderAndDecision(orderContents);

        // Add the order to the docket entry and perform a non-paper (electronic) service
        cy.get('[data-testid="add-court-issued-docket-entry-button"]').click();
        // Use the order title as the docket entry description so it will be indexed
        cy.get('body')
          .find('[data-testid="judge-select"]')
          .should('exist')
          .first()
          .select('Ashford');

        // Save the docket entry
        cy.get('[data-testid="serve-to-parties-btn"]').click();
        cy.get('[data-testid="modal-button-confirm"]').click();

        // Wait for WebSocket notification that document was served and indexed
        cy.task('waitForWebSocketMessage', { action: 'serve_document_complete', timeout: 20000 })
          .then((message) => {
            console.log('Document served notification received:', message);
          });

        // Cleanup WebSocket connection
        cy.task('disconnectWebSocket');

        /** Act */
        cy.get('[data-testid="search-link"]').click();
        cy.get('[data-testid="order-search-tab"]').click();
        cy.get('[data-testid="keyword-search-input"]').type(orderContents);
        let count: number;
        cy.intercept('GET', '**/order-search**').as('orderSearch');
        retry(() => {
          cy.get(
            '[data-testid="submit-order-advanced-search-button"], [data-testid="advanced-search-button"], button#advanced-search-button, form[data-testid="order-search-container"] button[type=submit]',
          )
            .first()
            .click();

          cy.wait('@orderSearch').then(({ response }) => {
            count = response?.body?.results?.length || 0;
          });

          cy.get('.search-results').should('exist');
          return assertExists(
            `[data-testid="docket-number-link-${docketNumber}"]`,
          );
        }, 12);

        /** Assert */
        // Ensure the results table exists and the new order appears as the first result
        cy.get('[data-testid="advanced-document-search-results-table"]').should(
          'exist',
        );
        cy.get(
          'table[data-testid="advanced-document-search-results-table"] tbody tr',
        )
          .first()
          .within(() => {
            cy.get(`[data-testid="docket-number-link-${docketNumber}"]`).should(
              'exist',
            );
          });

        /** Act */
        // Click the Filed Date header to toggle sorting
        cy.get('[data-testid="sort-button-filed-date"]').click();

        // click the paginator if needed
        cy.then(() => {
          if (count && count > ADVANCED_DOCUMENT_SEARCH_PAGE_SIZE) {
            const lastPage = Math.ceil(
              count / ADVANCED_DOCUMENT_SEARCH_PAGE_SIZE,
            );
            cy.get(`[data-testid="paginator-page-${lastPage}"]`)
              .first()
              .click();
          }
        });

        /** Assert */
        // After sorting, ensure the created order is present in the last row
        cy.get(
          'table[data-testid="advanced-document-search-results-table"] tbody tr',
        )
          .last()
          .within(() => {
            cy.get(`[data-testid="docket-number-link-${docketNumber}"]`).should(
              'exist',
            );
          });
      },
    );
  });

  it('should find matching results when the user searches for an opinion by keyword', () => {
    /** Arrange */
    loginAsPetitionsClerk1();
    createAndServePaperPetition({ includeApwDocument: false }).then(
      ({ docketNumber }) => {
        loginAsDocketClerk1();

        goToCase(docketNumber);

        const opinionTitle = `${faker.word.adjective()} ${faker.word.noun()}`;
        cy.get('[data-testid="case-detail-menu-button"]').click();
        cy.get('[data-testid="menu-button-upload-pdf"]').click();
        cy.get('[data-testid="upload-description"]').type(opinionTitle);
        attachFile({
          filePath: '../../helpers/file/sample.pdf',
          selector: '[data-testid="primary-document-file"]',
          selectorToAwaitOnSuccess: '[data-testid^="upload-file-success"]',
        });
        cy.get('[data-testid="save-uploaded-pdf-button"]').click();
        cy.get('[data-testid="add-court-issued-docket-entry-button"]').click();
        selectTypeaheadInput(
          'court-issued-document-type-search',
          'Summary Opinion',
        );
        cy.get('body')
          .find('[data-testid="judge-select"]')
          .then($el => $el.length && cy.wrap($el.first()).select('Ashford'));
        cy.get('[data-testid="serve-to-parties-btn"]').click();
        cy.get('[data-testid="modal-button-confirm"]').click();
        cy.get('[data-testid="print-paper-service-done-button"]').click();

        /** Act */
        cy.get('[data-testid="search-link"]').click();
        cy.get('[data-testid="opinion-search-tab"]').click();
        cy.get('[data-testid="keyword-search-input"]').type(opinionTitle);
        // need to wait for elasticsearch potentially
        let count: number;
        cy.intercept('GET', '**/opinion-search**').as('opinionSearch');
        retry(() => {
          cy.get(
            '[data-testid="submit-opinion-advanced-search-button"], [data-testid="advanced-search-button"], button#advanced-search-button, form[data-testid="opinion-search-container"] button[type=submit]',
          )
            .first()
            .click();
          cy.wait('@opinionSearch').then(({ response }) => {
            count = response?.body?.results?.length || 0;
          });
          cy.get('.search-results').should('exist');
          return assertExists(
            `[data-testid="docket-number-link-${docketNumber}"]`,
          );
        }, 12);
        /** Assert */
        // Ensure the results table exists and the new opinion appears as the first result
        cy.get('[data-testid="advanced-document-search-results-table"]').should(
          'exist',
        );
        cy.get(
          'table[data-testid="advanced-document-search-results-table"] tbody tr',
        )
          .first()
          .within(() => {
            cy.get(`[data-testid="docket-number-link-${docketNumber}"]`).should(
              'exist',
            );
          });

        /** Act */
        // Click the Filed Date header to toggle sorting
        cy.get('[data-testid="sort-button-filed-date"]').click();

        // click the paginator if needed
        cy.then(() => {
          if (count && count > ADVANCED_DOCUMENT_SEARCH_PAGE_SIZE) {
            const lastPage = Math.ceil(
              count / ADVANCED_DOCUMENT_SEARCH_PAGE_SIZE,
            );
            cy.get(`[data-testid="paginator-page-${lastPage}"]`)
              .first()
              .click();
          }
        });

        /** Assert */
        // After sorting, ensure the created opinion is present in the last row
        cy.get(
          'table[data-testid="advanced-document-search-results-table"] tbody tr',
        )
          .last()
          .within(() => {
            cy.get(`[data-testid="docket-number-link-${docketNumber}"]`).should(
              'exist',
            );
          });
      },
    );
  });
});
