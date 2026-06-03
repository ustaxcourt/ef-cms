const mockOrders = [
  {
    caseCaption: 'Zeta Corp, Petitioner',
    docketEntryId: 'aaa00001-0001-4000-8000-000000000001',
    docketNumber: '102-20',
    documentTitle: 'Order Denying Motion',
    eventCode: 'O',
    filingDate: '2026-06-03T15:00:00.000Z',
    numberOfPages: 3,
    signedJudgeName: 'Maurice B. Foley',
  },
  {
    caseCaption: 'Alpha LLC, Petitioner',
    docketEntryId: 'bbb00002-0002-4000-8000-000000000002',
    docketNumber: '101-20',
    documentTitle: 'Order Granting Motion',
    eventCode: 'O',
    filingDate: '2026-06-03T10:00:00.000Z',
    numberOfPages: 1,
    signedJudgeName: 'John O. Colvin',
  },
  {
    caseCaption: 'Midway Inc, Petitioner',
    docketEntryId: 'ccc00003-0003-4000-8000-000000000003',
    docketNumber: '103-20',
    documentTitle: 'Order to Show Cause',
    eventCode: 'O',
    filingDate: '2026-06-03T12:00:00.000Z',
    numberOfPages: 2,
    signedJudgeName: 'Kathleen Kerrigan',
  },
];

// Returns totalCount === results.length so the multi-page fetch loop terminates after one request.
const interceptTodaysOrders = () => {
  cy.intercept('GET', '/public-api/todays-orders/**', {
    body: { results: mockOrders, totalCount: mockOrders.length },
  }).as('getTodaysOrders');
};

const getJudgeCell = (rowIndex: number) =>
  cy
    .get('table[aria-label="todays orders"] tbody tr')
    .eq(rowIndex)
    .find('td')
    .eq(5);

const getDocumentTitleCell = (rowIndex: number) =>
  cy
    .get('table[aria-label="todays orders"] tbody tr')
    .eq(rowIndex)
    .find('td')
    .eq(3);

describe("Today's Orders - Sorting", () => {
  beforeEach(() => {
    interceptTodaysOrders();
    cy.visit('/todays-orders');
    cy.wait('@getTodaysOrders');
    cy.get('table[aria-label="todays orders"]').should('be.visible');
  });

  it('should display the mocked orders in the table', () => {
    cy.get('table[aria-label="todays orders"] tbody tr').should(
      'have.length',
      3,
    );
  });

  it('should default to sorting by filing date descending (newest first)', () => {
    // filingDate DESC → Foley (15:00), Kerrigan (12:00), Colvin (10:00)
    cy.get('[data-testid="0-filingDate-header-button"]')
      .find('.sortActive')
      .should('exist');
    getJudgeCell(0).should('contain.text', 'Foley');
    getJudgeCell(1).should('contain.text', 'Kerrigan');
    getJudgeCell(2).should('contain.text', 'Colvin');
  });

  it('should sort by filing date ascending when clicking the Time Filed header', () => {
    cy.get('[data-testid="0-filingDate-header-button"]').click();

    // filingDate ASC → Colvin (10:00), Kerrigan (12:00), Foley (15:00)
    getJudgeCell(0).should('contain.text', 'Colvin');
    getJudgeCell(1).should('contain.text', 'Kerrigan');
    getJudgeCell(2).should('contain.text', 'Foley');
  });

  it('should sort by document title ascending when clicking the Order header', () => {
    cy.get('[data-testid="3-documentTitle-header-button"]').click();

    // documentTitle ASC: "Order Denying Motion" < "Order Granting Motion" < "Order to Show Cause"
    getDocumentTitleCell(0).should('contain.text', 'Order Denying Motion');
    getDocumentTitleCell(1).should('contain.text', 'Order Granting Motion');
    getDocumentTitleCell(2).should('contain.text', 'Order to Show Cause');
  });

  it('should sort by document title descending when clicking the Order header a second time', () => {
    cy.get('[data-testid="3-documentTitle-header-button"]').click();
    cy.get('[data-testid="3-documentTitle-header-button"]').click();

    // documentTitle DESC: "Order to Show Cause" > "Order Granting Motion" > "Order Denying Motion"
    getDocumentTitleCell(0).should('contain.text', 'Order to Show Cause');
    getDocumentTitleCell(1).should('contain.text', 'Order Granting Motion');
    getDocumentTitleCell(2).should('contain.text', 'Order Denying Motion');
  });

  it('should sort by judge name ascending when clicking the Judge header', () => {
    cy.get('[data-testid="5-formattedJudgeName-header-button"]').click();

    // formattedJudgeName ASC: Colvin < Foley < Kerrigan
    getJudgeCell(0).should('contain.text', 'Colvin');
    getJudgeCell(1).should('contain.text', 'Foley');
    getJudgeCell(2).should('contain.text', 'Kerrigan');
  });

  it('should move the active sort indicator to the clicked column header', () => {
    cy.get('[data-testid="3-documentTitle-header-button"]').click();

    cy.get('[data-testid="3-documentTitle-header-button"]')
      .find('.sortActive')
      .should('exist');
    cy.get('[data-testid="0-filingDate-header-button"]')
      .find('.sortActive')
      .should('not.exist');
  });
});

// 103 orders → 2 pages (100 on page 1, 3 on page 2).
// i=0 is newest so that filingDate DESC (the default) puts it first.
const TOTAL_PAGINATION_ORDERS = 103;
const paginationMockOrders = Array.from(
  { length: TOTAL_PAGINATION_ORDERS },
  (_, i) => ({
    caseCaption: `Case ${i + 1}, Petitioner`,
    docketEntryId: `${String(i + 1).padStart(8, '0')}-0001-4000-8000-${String(i + 1).padStart(12, '0')}`,
    docketNumber: `${100 + i + 1}-20`,
    // Padded so "Order #001" is not a substring of "Order #010"
    documentTitle: `Order #${String(i + 1).padStart(3, '0')}`,
    eventCode: 'O',
    // i=0 → 23:59:59Z (newest); each increment subtracts one minute
    filingDate: (() => {
      const totalMinutes = 23 * 60 + 59 - i;
      const hh = String(Math.floor(totalMinutes / 60)).padStart(2, '0');
      const mm = String(totalMinutes % 60).padStart(2, '0');
      return `2026-06-03T${hh}:${mm}:59.000Z`;
    })(),
    numberOfPages: (i % 10) + 1,
    signedJudgeName: [
      'Maurice B. Foley',
      'John O. Colvin',
      'Kathleen Kerrigan',
      'Albert G. Lauber',
      'Richard T. Morrison',
    ][i % 5],
  }),
);

describe("Today's Orders - Pagination", () => {
  beforeEach(() => {
    cy.intercept('GET', '/public-api/todays-orders/**', {
      body: {
        results: paginationMockOrders,
        totalCount: TOTAL_PAGINATION_ORDERS,
      },
    }).as('getTodaysOrders');
    cy.visit('/todays-orders');
    cy.wait('@getTodaysOrders');
    cy.get('table[aria-label="todays orders"]').should('be.visible');
  });

  it('should show the paginator when results span more than one page', () => {
    cy.get('[data-testid="paginator-page-1"]').first().should('exist');
    cy.get('[data-testid="paginator-page-2"]').first().should('exist');
  });

  it('should display page 1 with 100 rows and page 1 highlighted', () => {
    cy.get('table[aria-label="todays orders"] tbody tr').should(
      'have.length',
      100,
    );
    cy.get('[data-testid="paginator-page-1"]')
      .first()
      .should('have.class', 'paginator-current');
    // Default filingDate DESC: i=0 (newest) is first → "Order #001"
    cy.get('table[aria-label="todays orders"] tbody tr')
      .first()
      .find('td')
      .eq(3)
      .should('contain.text', 'Order #001');
  });

  it('should navigate to page 2 and show the remaining 3 rows', () => {
    cy.get('[data-testid="paginator-page-2"]').first().click();

    cy.get('table[aria-label="todays orders"] tbody tr').should(
      'have.length',
      3,
    );
    cy.get('[data-testid="paginator-page-2"]')
      .first()
      .should('have.class', 'paginator-current');
    // filingDate DESC: page 2 starts at i=100 → "Order #101"
    cy.get('table[aria-label="todays orders"] tbody tr')
      .first()
      .find('td')
      .eq(3)
      .should('contain.text', 'Order #101');
  });

  it('should navigate forward via the Next button', () => {
    cy.get('[aria-label="Next page"]').first().click();

    cy.get('[data-testid="paginator-page-2"]')
      .first()
      .should('have.class', 'paginator-current');
    cy.get('table[aria-label="todays orders"] tbody tr').should(
      'have.length',
      3,
    );
  });

  it('should navigate back to page 1 via the Previous button', () => {
    cy.get('[data-testid="paginator-page-2"]').first().click();
    cy.get('[aria-label="Previous page"]').first().click();

    cy.get('[data-testid="paginator-page-1"]')
      .first()
      .should('have.class', 'paginator-current');
    cy.get('table[aria-label="todays orders"] tbody tr').should(
      'have.length',
      100,
    );
  });

  it('should display the total order count', () => {
    cy.contains(`${TOTAL_PAGINATION_ORDERS.toLocaleString()} Order(s)`).should(
      'exist',
    );
  });
});
