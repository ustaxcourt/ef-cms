import { loginAsAdmissionsClerk } from '../../../../helpers/authentication/login-as-helpers';

describe('Practitioner Information', () => {
  const barNumber = 'RT6789';

  before(() => {
    loginAsAdmissionsClerk();
    cy.get('[data-testid="search-link"]').click();
    cy.get('[data-testid="practitioner-search-tab"]').click();
    cy.get('[data-testid="bar-number-search-input"]').type(barNumber);
    cy.get('[data-testid="practitioner-search-by-bar-number-button"]').click();
  });

  describe('Open Cases Tab', () => {
    it('should display correct number of open cases', () => {
      cy.contains('#tabButton-practitionerOpenCases', '(7)');
    });
    it('should render correct number of open cases', () => {
      cy.get('#tabButton-practitionerOpenCases').click();
      cy.get('tr').should('have.length', 7);
    });
  });

  describe('Closed Cases Tab', () => {
    it('should display correct number of closed cases', () => {
      cy.contains('#tabButton-practitionerClosedCases', '(0)');
    });
    it('should render correct number of closed cases', () => {
      cy.get('#tabButton-practitionerClosedCases').click();
      cy.get('tr').should('have.length', 0);
    });
  });
});
