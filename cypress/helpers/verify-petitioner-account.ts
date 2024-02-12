import qs from 'qs';

export function verifyPetitionerAccount({ email }: { email: string }) {
  cy.task('getNewAccountVerificationCode', { email }).then((userInfo: any) => {
    expect(userInfo).to.have.property('userId').that.is.not.undefined;
    expect(userInfo).to.have.property('confirmationCode').that.is.not.undefined;
    const { confirmationCode, userId } = userInfo;
    const queryString = qs.stringify(
      { confirmationCode, email, userId },
      { encode: true },
    );
    cy.visit(`/confirm-signup?${queryString}`);
    cy.get('[data-testid="success-alert"]').should('exist');
  });
}
