export function addIntervenorAsPartyToCase() {
  cy.get('[data-testid="tab-case-information"] > .button-text').click();
  cy.get('[data-testid="tab-parties"] > .button-text').click();
  cy.get('.grid-gap > .grid-col-3 > .margin-right-0').click();
  cy.get('[data-testid="add-petitioner-contact-type"]').select('intervenor');
  cy.get('[data-testid="add-petitioner-name"]').type('James Larson');
  cy.get('[data-testid="contact.address1"]').type('123 Main St');
  cy.get('[data-testid="contact.city"]').type('Charlotte');
  cy.get('[data-testid="contact.state"]').select('DE');
  cy.get('[data-testid="contact.postalCode"]').type('11111');
  cy.get('[data-testid="add-petitioner-phone"]').type('1234567890');
  cy.get('[data-testid="service-type-none-label-form.contact"]').click();
  cy.get('[data-testid="add-petitioner-submit-button"]').click();
}
