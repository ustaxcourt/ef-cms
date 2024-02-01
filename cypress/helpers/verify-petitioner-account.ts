import qs from 'qs';

export function verifyPetitionerAccount({ email }: { email: string }) {
  cy.task('getNewAccountVerificationCode', { email }).as('USER_COGNITO_INFO');

  cy.get('@USER_COGNITO_INFO')
    .should('have.a.property', 'userId')
    .and('not.be.undefined');

  cy.get('@USER_COGNITO_INFO')
    .should('have.a.property', 'confirmationCode')
    .and('not.be.undefined');

  cy.get('@USER_COGNITO_INFO').then((userInfo: any) => {
    const { confirmationCode, userId } = userInfo;
    const queryString = qs.stringify(
      { confirmationCode, email, userId },
      { encode: false },
    );
    cy.visit(`/confirm-signup?${queryString}`);
  });

  cy.get('[data-testid="success-alert"]').should('exist');
}
