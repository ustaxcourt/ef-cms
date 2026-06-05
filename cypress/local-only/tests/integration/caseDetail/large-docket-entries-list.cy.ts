import { createAndServePaperPetition } from '../../../../helpers/fileAPetition/create-and-serve-paper-petition';
import { goToCase } from '../../../../helpers/caseDetail/go-to-case';
import { loginAsDocketClerk } from '../../../../helpers/authentication/login-as-helpers';
import { v4 as uuidv4 } from 'uuid';

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

  beforeEach(() => {
    createAndServePaperPetition().then(result => {
      cy.wrap(result.docketNumber).as('docketNumber');
      const mockDocketEntries = generateMockDocketEntries(
        result.docketNumber,
        LARGE_ENTRY_COUNT,
      );

      cy.intercept(
        'GET',
        `**/cases/${result.docketNumber}/docket-entries*`,
        req => {
          req.reply({
            body: {
              docketEntries: mockDocketEntries,
              page: 0,
              pageSize: LARGE_ENTRY_COUNT,
              totalCount: LARGE_ENTRY_COUNT,
            },
          });
        },
      ).as('getDocketEntries');

      cy.intercept(
        'GET',
        `**/case-documents/${result.docketNumber}/*/document-download-url*`,
        { url: 'http://localhost:4000/mock-pdf-url' },
      );
    });

    loginAsDocketClerk();
  });

  it('should render the virtualized document list when docket entries exceed 1000', () => {
    cy.get<string>('@docketNumber').then(docketNumber => {
      goToCase(docketNumber);
    });
    cy.get('#tab-document-view').click();

    cy.wait('@getDocketEntries');

    cy.get('[data-testid="document-view-container"]').should('exist');
    cy.get('[data-testid="document-viewer-documents-list"]').should('exist');

    cy.get('.attachment-viewer-button.virtualized').should(
      'have.length.lessThan',
      100,
    );

    cy.get('.attachment-viewer-button.virtualized').should(
      'have.length.greaterThan',
      0,
    );
  });

  it('should allow clicking a document entry in the virtualized list', () => {
    cy.get<string>('@docketNumber').then(docketNumber => {
      goToCase(docketNumber);
    });
    cy.get('#tab-document-view').click();

    cy.wait('@getDocketEntries');

    cy.get('[data-testid="document-view-container"]').should('exist');

    cy.get('.attachment-viewer-button.virtualized').first().should('exist');

    cy.get('.attachment-viewer-button.virtualized')
      .not('.active')
      .first()
      .click();

    cy.get('.attachment-viewer-button.virtualized.active').should(
      'have.length',
      1,
    );
  });

  it('should display document details correctly in virtualized rows', () => {
    cy.get<string>('@docketNumber').then(docketNumber => {
      goToCase(docketNumber);
    });
    cy.get('#tab-document-view').click();

    cy.wait('@getDocketEntries');

    cy.get('[data-testid="document-view-container"]').should('exist');

    cy.get('.attachment-viewer-button.virtualized')
      .first()
      .should('contain.text', 'Test Document');
  });

  it('should render entries correctly after scrolling the virtualized list', () => {
    cy.get<string>('@docketNumber').then(docketNumber => {
      goToCase(docketNumber);
    });
    cy.get('#tab-document-view').click();

    cy.wait('@getDocketEntries');

    cy.get('[data-testid="document-view-container"]').should('exist');

    cy.get('.document-viewer--documents-list > div').first().scrollTo(0, 5000);

    cy.get('.attachment-viewer-button.virtualized').should(
      'have.length.greaterThan',
      0,
    );
  });

  it('should maintain correct sort order by No. when scrolling through the virtualized list', () => {
    cy.get<string>('@docketNumber').then(docketNumber => {
      goToCase(docketNumber);
    });
    cy.get('#tab-document-view').click();

    cy.wait('@getDocketEntries');

    cy.get('[data-testid="document-view-container"]').should('exist');

    cy.get('.attachment-viewer-button.virtualized .grid-col-2').then($cols => {
      const numbers = Array.from($cols)
        .map(el => parseInt(el.textContent!.trim(), 10))
        .filter(n => !isNaN(n));
      for (let i = 1; i < numbers.length; i++) {
        expect(numbers[i]).to.be.greaterThan(numbers[i - 1]);
      }
    });

    cy.get('[data-testid="document-viewer-documents-list"] > div')
      .first()
      .scrollTo(0, 5000);

    cy.get('.attachment-viewer-button.virtualized .grid-col-2').then($cols => {
      const numbers = Array.from($cols)
        .map(el => parseInt(el.textContent!.trim(), 10))
        .filter(n => !isNaN(n));
      expect(numbers.length).to.be.greaterThan(0);
      for (let i = 1; i < numbers.length; i++) {
        expect(numbers[i]).to.be.greaterThan(numbers[i - 1]);
      }
    });

    cy.get('[data-testid="document-viewer-documents-list"] > div')
      .first()
      .scrollTo(0, 15000);

    cy.get('.attachment-viewer-button.virtualized .grid-col-2').then($cols => {
      const numbers = Array.from($cols)
        .map(el => parseInt(el.textContent!.trim(), 10))
        .filter(n => !isNaN(n));
      expect(numbers.length).to.be.greaterThan(0);
      for (let i = 1; i < numbers.length; i++) {
        expect(numbers[i]).to.be.greaterThan(numbers[i - 1]);
      }
    });
  });

  it('should paginate the docket record tab when entries exceed threshold', () => {
    cy.get<string>('@docketNumber').then(docketNumber => {
      goToCase(docketNumber);
    });

    cy.wait('@getDocketEntries');

    cy.get('[data-testid="tab-docket-record"]').should('exist');

    cy.get('[data-testid="paginator-page-1"]').first().should('exist');
    cy.get('[data-testid="paginator-page-2"]').first().should('exist');

    cy.get('[data-testid="docket-entry-index-1"]').should('exist');

    cy.get('[data-testid="paginator-page-2"]').first().click();

    cy.get('[data-testid="docket-entry-index-501"]').should('exist');
    cy.get('[data-testid="docket-entry-index-1"]').should('not.exist');

    cy.get('[data-testid="paginator-page-1"]').first().click();
    cy.get('[data-testid="docket-entry-index-1"]').should('exist');
  });

  it('should sort docket record entries by No. in descending order and maintain pagination', () => {
    cy.get<string>('@docketNumber').then(docketNumber => {
      goToCase(docketNumber);
    });

    cy.wait('@getDocketEntries');

    cy.get('[data-testid="index-sortable-button"]').click();
    cy.get('[data-testid="index-sortable-button"]').click();

    cy.get('[data-testid="docket-entry-index-1050"]').should('exist');

    cy.get('td[data-testid^="docket-entry-index-"]').then($cells => {
      const indices = Array.from($cells)
        .map(el => parseInt(el.textContent!.trim(), 10))
        .filter(n => !isNaN(n));
      expect(indices.length).to.be.greaterThan(0);
      for (let i = 1; i < indices.length; i++) {
        expect(indices[i]).to.be.lessThan(indices[i - 1]);
      }
    });

    cy.get('[data-testid="paginator-page-2"]').first().click();

    cy.get('td[data-testid^="docket-entry-index-"]').then($cells => {
      const indices = Array.from($cells)
        .map(el => parseInt(el.textContent!.trim(), 10))
        .filter(n => !isNaN(n));
      expect(indices.length).to.be.greaterThan(0);
      for (let i = 1; i < indices.length; i++) {
        expect(indices[i]).to.be.lessThan(indices[i - 1]);
      }
    });

    cy.get('[data-testid="index-sortable-button"]').click();

    cy.get('[data-testid="paginator-page-1"]').first().click();

    cy.get('[data-testid="docket-entry-index-1"]').should('exist');

    cy.get('td[data-testid^="docket-entry-index-"]').then($cells => {
      const indices = Array.from($cells)
        .map(el => parseInt(el.textContent!.trim(), 10))
        .filter(n => !isNaN(n));
      expect(indices.length).to.be.greaterThan(0);
      for (let i = 1; i < indices.length; i++) {
        expect(indices[i]).to.be.greaterThan(indices[i - 1]);
      }
    });
  });
});
