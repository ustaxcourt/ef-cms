describe('Petitioner Account Creation', () => {
  const GUID = Date.now();
  const TEST_EMAIL = `cypress+${GUID}@test.com`;
  const TEST_NAME = 'Cypress Test';
  const TEST_PASSWORD = 'aA1!aaaa';
  describe('Create Petitioner Account', () => {
    beforeEach(() => {
      cy.visit('/create-account/petitioner');
    });

    it('should fill out the account creation form', () => {
      cy.get('[data-testid="petitioner-account-creation-email"]').type(
        TEST_EMAIL,
      );

      cy.get('[data-testid="petitioner-account-creation-name"]').type(
        TEST_NAME,
      );

      cy.get('[data-testid="petitioner-account-creation-password"]').type(
        TEST_PASSWORD,
      );

      cy.get(
        '[data-testid="petitioner-account-creation-confirm-password"]',
      ).type(TEST_PASSWORD);
    });
  });
});
