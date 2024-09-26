import { loginAsAdmissionsClerk } from '../../../../helpers/authentication/login-as-helpers';

describe('Practitioner Information', () => {
  const barNumber = 'PT1234';

  before(() => {
    loginAsAdmissionsClerk();
    cy.get('[data-testid="search-link"]').click();
    cy.get('[data-testid="practitioner-search-tab"]').click();
    cy.get('[data-testid="bar-number-search-input"]').type(barNumber);
    cy.get('[data-testid="practitioner-search-by-bar-number-button"]').click();
  });

  describe('Open Cases Tab', () => {
    it('should display number of cases in the tab header and list the correct number of open cases', () => {
      cy.get('#tabButton-practitionerOpenCases').click();
      cy.contains('#tabButton-practitionerOpenCases', /\(\d+\)/)
        .invoke('text')
        .then(text => {
          const match = text.match(/\d+/);
          const numberInParentheses = parseInt(match![0], 10); // Extract and convert the header number
          // The seeded data has at least 7 cases, but other tests sometimes add them.
          expect(numberInParentheses).to.be.greaterThan(6);
          cy.get('tr').should('have.length', numberInParentheses + 1); // Include the header tr in the count
        });
    });
  });
  describe('Closed Cases Tab', () => {
    it('should display correct number of closed cases in tab header', () => {
      cy.contains('#tabButton-practitionerClosedCases', '(0)');
    });
    it('should render correct number of closed cases in list', () => {
      cy.get('#tabButton-practitionerClosedCases').click();
      cy.get('tr').should('have.length', 0);
    });
  });
});
