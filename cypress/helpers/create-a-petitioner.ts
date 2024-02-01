export function createAPetitioner({
  email,
  name,
  password,
}: {
  email: string;
  name: string;
  password: string;
}) {
  cy.visit('/create-account/petitioner');

  cy.get('[data-testid="petitioner-account-creation-email"]').type(email);
  cy.get('[data-testid="petitioner-account-creation-name"]').type(name);
  cy.get('[data-testid="petitioner-account-creation-password"]').type(password);
  cy.get('[data-testid="petitioner-account-creation-confirm-password"]').type(
    password,
  );

  cy.get('[data-testid="petitioner-account-creation-submit-button"]').click();
  cy.get('[data-testid="email-address-verification-sent-message"]').should(
    'exist',
  );
}
