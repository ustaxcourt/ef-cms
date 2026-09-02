import { checkA11y } from '../../../../support/generalCommands/checkA11y';

// Standing orders (SPOS/SPTO/SSO) carry their judge on `judge` rather than
// `signedJudgeName`, so todaysOrdersHelper resolves the judge column through a
// different branch. Stubbed so the scan does not depend on a standing order
// having been served today.
const standingOrderResults = [
  {
    caseCaption: 'Gamma Holdings, Petitioner',
    docketEntryId: 'ddd00004-0004-4000-8000-000000000004',
    docketNumber: '104-20',
    documentTitle: 'Standing Scheduling Order',
    entityName: 'PublicDocumentSearchResult',
    eventCode: 'SSO',
    filingDate: '2026-06-03T09:00:00.000Z',
    judge: 'Cohen',
    numberOfPages: 2,
  },
];

describe('Todays Orders - Accessibility', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  it('should be free of a11y issues', () => {
    cy.visit('/todays-orders');
    cy.get('.todays-orders').should('exist');

    checkA11y();
  });

  it('should be free of a11y issues when a standing order resolves its judge from the judge field', () => {
    cy.intercept('GET', '/public-api/todays-orders/**', {
      body: {
        results: standingOrderResults,
        totalCount: standingOrderResults.length,
      },
    }).as('getTodaysOrders');

    cy.visit('/todays-orders');
    cy.wait('@getTodaysOrders');
    cy.get('table[aria-label="todays orders"]').should('be.visible');
    cy.contains('td', 'Cohen').should('exist');

    checkA11y();
  });
});
