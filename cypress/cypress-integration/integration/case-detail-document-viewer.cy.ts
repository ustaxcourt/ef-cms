describe('Petitions clerk verifies document viewer pdf resets when navigating from one case to another', () => {
  // click on messages
  // click on second message
  // click on docket record
  it('changeme', () => {
    // login as petitionsclerk
    cy.login('petitionsclerk');

    // click on first message
    cy.get('[data-cy="message-detail"]').first().click();

    // click on docket record
    cy.get('button#tab-docket-record').click();

    cy.get('button#tab-document-view').click();

    cy.get('[data-cy="view-full-pdf"]').click();

    let firstPdfUrl;

    cy.location().then(url => (firstPdfUrl = url));

    cy.visit('/');

    cy.get('[data-cy="message-detail"]').eq(1).click();

    cy.get('button#tab-docket-record').click();

    cy.get('button#tab-document-view').click();

    cy.get('[data-cy="view-full-pdf"]').click();

    cy.location().then(url => {
      expect(url).to.not.equal(firstPdfUrl);
    });
  });
});
