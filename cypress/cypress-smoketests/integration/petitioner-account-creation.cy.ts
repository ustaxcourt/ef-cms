describe('Petitioner Account Creation', () => {
  const GUID = Date.now();
  const TEST_EMAIL = `cypress+${GUID}@test.com`;
  const TEST_NAME = 'Cypress Test';
  const TEST_PASSWORD = 'aA1!aaaa';

  describe('Create Petitioner Account', () => {
    beforeEach(() => {
      cy.visit('/create-account/petitioner');
    });

    it('should create an account and verify it using the verification link', () => {
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

      cy.get(
        '[data-testid="petitioner-account-creation-submit-button"]',
      ).click();

      cy.get('[data-testid="email-address-verification-sent-message"]').should(
        'exist',
      );

      cy.task('getNewAccountVerificationCode', { email: TEST_EMAIL }).as(
        'USER_COGNITO_INFO',
      );

      cy.get('@USER_COGNITO_INFO')
        .should('have.a.property', 'userId')
        .and('not.be.undefined');

      cy.get('@USER_COGNITO_INFO')
        .should('have.a.property', 'confirmationCode')
        .and('not.be.undefined');

      cy.get('@USER_COGNITO_INFO').then((userInfo: any) => {
        const { confirmationCode, userId } = userInfo;
        cy.visit(
          `/confirm-signup?confirmationCode="${confirmationCode}"&email="${TEST_EMAIL}"&userId="${userId}"`,
        );
      });

      cy.get('[data-testid="success-alert"]').should('exist');
    });
  });
});
