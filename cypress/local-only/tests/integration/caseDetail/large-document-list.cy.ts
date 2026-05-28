import { createAndServePaperPetition } from '../../../../helpers/fileAPetition/create-and-serve-paper-petition';
import { goToCase } from '../../../../helpers/caseDetail/go-to-case';
import { loginAsDocketClerk } from '../../../../helpers/authentication/login-as-helpers';
import { v4 as uuidv4 } from 'uuid';

/**
 * Generates an array of mock docket entries that will satisfy the
 * formattedDocketEntries computed (isOnDocketRecord: true) so that
 * DocumentViewer renders the VirtualizedDocumentList (threshold > 1000).
 */
function generateMockDocketEntries(docketNumber: string, count: number) {
  const entries: any[] = [];
  for (let i = 0; i < count; i++) {
    entries.push({
      createdAt: `2020-01-${String((i % 28) + 1).padStart(2, '0')}T12:00:00.000Z`,
      docketEntryId: uuidv4(),
      docketNumber,
      documentStorageId: uuidv4(),
      documentTitle: `Test Document ${i + 1}`,
      documentType: 'Order',
      draftOrderState: {},
      entityName: 'DocketEntry',
      eventCode: 'O',
      filedByRole: 'docketclerk',
      filers: [],
      filingDate: `2020-01-${String((i % 28) + 1).padStart(2, '0')}T05:00:00.000Z`,
      index: i + 1,
      isDraft: false,
      isFileAttached: true,
      isOnDocketRecord: true,
      isStricken: false,
      pending: false,
      processingStatus: 'complete',
      receivedAt: `2020-01-${String((i % 28) + 1).padStart(2, '0')}T05:00:00.000Z`,
      servedAt: `2020-01-${String((i % 28) + 1).padStart(2, '0')}T12:00:00.000Z`,
      servedParties: [{ name: 'IRS', role: 'irsSuperuser' }],
      stampData: {},
      userId: '1805d1ab-18d0-43ec-bafb-654e83405416',
    });
  }
  return entries;
}

describe('VirtualizedDocumentList - Large Document List', () => {
  const LARGE_ENTRY_COUNT = 1050;

  it('should render the virtualized document list when docket entries exceed 1000', () => {
    createAndServePaperPetition().then(({ docketNumber }) => {
      loginAsDocketClerk();

      const mockDocketEntries = generateMockDocketEntries(
        docketNumber,
        LARGE_ENTRY_COUNT,
      );

      // Intercept the docket entries API call and return a large set
      cy.intercept('GET', `**/cases/${docketNumber}/docket-entries*`, req => {
        req.reply({
          body: {
            docketEntries: mockDocketEntries,
            page: 0,
            pageSize: LARGE_ENTRY_COUNT,
            totalCount: LARGE_ENTRY_COUNT,
          },
        });
      }).as('getDocketEntries');

      // Intercept document download URL requests to prevent 404s on mock entries
      cy.intercept(
        'GET',
        `**/case-documents/${docketNumber}/*/document-download-url*`,
        { url: 'http://localhost:4000/mock-pdf-url' },
      );

      goToCase(docketNumber);
      cy.get('#tab-document-view').click();

      cy.wait('@getDocketEntries');

      // The document-view-container should render
      cy.get('[data-testid="document-view-container"]').should('exist');

      // The virtualized list container should be present
      cy.get('.document-viewer--documents-list').should('exist');

      // Verify that not all 1050 entries are rendered in the DOM at once
      // (virtualization means only visible + overscan rows are in the DOM)
      cy.get('.attachment-viewer-button.virtualized').should(
        'have.length.lessThan',
        100,
      );

      // Verify that at least some entries are rendered
      cy.get('.attachment-viewer-button.virtualized').should(
        'have.length.greaterThan',
        0,
      );
    });
  });

  it('should allow clicking a document entry in the virtualized list', () => {
    createAndServePaperPetition().then(({ docketNumber }) => {
      loginAsDocketClerk();

      const mockDocketEntries = generateMockDocketEntries(
        docketNumber,
        LARGE_ENTRY_COUNT,
      );

      cy.intercept('GET', `**/cases/${docketNumber}/docket-entries*`, req => {
        req.reply({
          body: {
            docketEntries: mockDocketEntries,
            page: 0,
            pageSize: LARGE_ENTRY_COUNT,
            totalCount: LARGE_ENTRY_COUNT,
          },
        });
      }).as('getDocketEntries');

      cy.intercept(
        'GET',
        `**/case-documents/${docketNumber}/*/document-download-url*`,
        { url: 'http://localhost:4000/mock-pdf-url' },
      );

      goToCase(docketNumber);
      cy.get('#tab-document-view').click();

      cy.wait('@getDocketEntries');

      cy.get('[data-testid="document-view-container"]').should('exist');

      // The first rendered entry should be visible
      cy.get('.attachment-viewer-button.virtualized').first().should('exist');

      // Click a different visible entry
      cy.get('.attachment-viewer-button.virtualized')
        .not('.active')
        .first()
        .click();

      // The clicked entry should now be active
      cy.get('.attachment-viewer-button.virtualized.active').should(
        'have.length',
        1,
      );
    });
  });

  it('should display document details correctly in virtualized rows', () => {
    createAndServePaperPetition().then(({ docketNumber }) => {
      loginAsDocketClerk();

      const mockDocketEntries = generateMockDocketEntries(
        docketNumber,
        LARGE_ENTRY_COUNT,
      );

      cy.intercept('GET', `**/cases/${docketNumber}/docket-entries*`, req => {
        req.reply({
          body: {
            docketEntries: mockDocketEntries,
            page: 0,
            pageSize: LARGE_ENTRY_COUNT,
            totalCount: LARGE_ENTRY_COUNT,
          },
        });
      }).as('getDocketEntries');

      cy.intercept(
        'GET',
        `**/case-documents/${docketNumber}/*/document-download-url*`,
        { url: 'http://localhost:4000/mock-pdf-url' },
      );

      goToCase(docketNumber);
      cy.get('#tab-document-view').click();

      cy.wait('@getDocketEntries');

      cy.get('[data-testid="document-view-container"]').should('exist');

      // Verify that the rendered rows contain expected document text
      cy.get('.attachment-viewer-button.virtualized')
        .first()
        .should('contain.text', 'Test Document');
    });
  });

  it('should render entries correctly after scrolling the virtualized list', () => {
    createAndServePaperPetition().then(({ docketNumber }) => {
      loginAsDocketClerk();

      const mockDocketEntries = generateMockDocketEntries(
        docketNumber,
        LARGE_ENTRY_COUNT,
      );

      cy.intercept('GET', `**/cases/${docketNumber}/docket-entries*`, req => {
        req.reply({
          body: {
            docketEntries: mockDocketEntries,
            page: 0,
            pageSize: LARGE_ENTRY_COUNT,
            totalCount: LARGE_ENTRY_COUNT,
          },
        });
      }).as('getDocketEntries');

      cy.intercept(
        'GET',
        `**/case-documents/${docketNumber}/*/document-download-url*`,
        { url: 'http://localhost:4000/mock-pdf-url' },
      );

      goToCase(docketNumber);
      cy.get('#tab-document-view').click();

      cy.wait('@getDocketEntries');

      cy.get('[data-testid="document-view-container"]').should('exist');

      // Scroll the virtualized list down
      cy.get('.document-viewer--documents-list > div')
        .first()
        .scrollTo(0, 5000);

      // Verify rows are still being rendered after scrolling
      cy.get('.attachment-viewer-button.virtualized').should(
        'have.length.greaterThan',
        0,
      );
    });
  });
});
