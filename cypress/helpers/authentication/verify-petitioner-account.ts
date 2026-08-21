import qs from 'qs';

export function verifyPetitionerAccount({ email }: { email: string }) {
  cy.task('getNewAccountVerificationCode', { email }).then((userInfo: any) => {
    expect(userInfo).to.have.property('userId');
    expect(userInfo).to.have.property('confirmationCode');
    const { confirmationCode, userId } = userInfo;
    expect(userId).to.be.a('string');
    expect(userId.length).to.be.greaterThan(0);
    expect(confirmationCode).to.be.a('string');
    expect(confirmationCode.length).to.be.greaterThan(0);
    const queryString = qs.stringify(
      { confirmationCode, email, userId },
      { encode: true },
    );
    cy.visit(`/confirm-signup?${queryString}`);
    cy.get('[data-testid="success-alert"]').should('exist');
  });
}
