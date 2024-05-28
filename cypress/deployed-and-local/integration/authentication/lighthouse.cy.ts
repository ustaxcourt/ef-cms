import '@cypress-audit/lighthouse/commands';

describe('lighthouse test', () => {
  it('should not have accessibility on the login page', () => {
    cy.visit('/login');
    cy.lighthouse({
      accessibility: 100,
      'best-practices': 85,
    });
  });
});
