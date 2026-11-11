describe('Public API response coverage', () => {
  it("should return a valid response for today's opinions", () => {
    cy.intercept('GET', '/public-api/todays-opinions').as('getTodaysOpinions');

    cy.visit('/todays-opinions');

    cy.wait('@getTodaysOpinions')
      .its('response.statusCode')
      .should('equal', 200);
  });

  it("should return a valid response for today's orders", () => {
    cy.intercept('GET', '/public-api/todays-orders/**').as('getTodaysOrders');

    cy.visit('/todays-orders');

    cy.wait('@getTodaysOrders').its('response.statusCode').should('equal', 200);
  });

  it('should validate the public docket-record PDF job responses', () => {
    cy.intercept('POST', '/public-api/cases/103-20/generate-docket-record').as(
      'startDocketRecordGeneration',
    );
    cy.intercept('GET', '/public-api/docket-record-status/*').as(
      'getDocketRecordStatus',
    );

    cy.visit('/case-detail/103-20');
    cy.get('table#docket-record-table').should('be.visible');
    cy.get('[data-testid="print-public-docket-record-button"]').click();

    cy.wait('@startDocketRecordGeneration')
      .its('response.statusCode')
      .should('equal', 200);
    cy.wait('@getDocketRecordStatus')
      .its('response.statusCode')
      .should('equal', 200);
    cy.contains('Your printable docket record is ready to be viewed.').should(
      'be.visible',
    );
  });

  it('should not expose the removed users-in-section endpoint', () => {
    cy.request({
      failOnStatusCode: false,
      url: 'http://localhost:4001/sections/example/users',
    })
      .its('status')
      .should('equal', 404);
  });
});
