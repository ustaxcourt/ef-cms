import {
  createISODateString,
  formatDateString,
  FORMATS,
} from '@shared/business/utilities/DateHandler';
import { loginAsDocketClerk } from 'cypress/helpers/authentication/login-as-helpers';

describe('user runs a case deadlines report', () => {
  const startDate = '01/01/2025';
  const endDate = '06/06/2025';
  before(() => {});
  it('should update the header', () => {
    loginAsDocketClerk();
    cy.get('[data-testid="dropdown-select-report"]').click();
    cy.get('#all-deadlines').click();

    cy.get('#deadlineStart-date-start').clear();
    cy.get('#deadlineStart-date-start').type(startDate);
    cy.get('#deadlineEnd-date-end').clear();
    cy.get('#deadlineEnd-date-end').type(endDate);
    cy.get(
      '[aria-describedby="case-deadlines-tab case-deadlines-filter-label"]',
    ).select('Colvin');
    cy.get('[data-testid="submit-case-deadlines-report-button"]').click();

    cy.get('[data-test-id="case-deadline-report-header"]').should(
      'contain.text',
      formatDateString(
        createISODateString(startDate, FORMATS.MMDDYYYY),
        FORMATS.MONTH_DAY_YEAR,
      ),
    );
    cy.get('[data-test-id="case-deadline-report-header"]').should(
      'contain.text',
      formatDateString(
        createISODateString(endDate, FORMATS.MMDDYYYY),
        FORMATS.MONTH_DAY_YEAR,
      ),
    );
  });
});
