import { loginAsTrialClerk } from 'cypress/helpers/authentication/login-as-helpers';

const pickFirstMinuteSheet = () => {
  cy.get('#open-cases tbody tr:first-child td:nth-child(2) a')
    .first()
    .invoke('text')
    .then(docketNumber => {
      // Trim any whitespace from the docket number
      const trimmedDocketNumber = docketNumber.trim();
      cy.log(`Docket Number:  ${trimmedDocketNumber}`);

      // Use the docket number to click the minute sheet button
      cy.get(
        `[data-testId="minute-sheet-button-${trimmedDocketNumber}"]`,
      ).click();
    });
};

describe('Access a minute sheet', () => {
  //   beforeEach(() => cy.wait(1000));

  it('access trialsessions page', () => {
    // login as trialclerk1
    loginAsTrialClerk();
    cy.get('[data-testid="trial-session-link"]').click();
    // get minutes sheet link for houston
    cy.get('a').contains('Houston, Texas').click();
  });

  it('Open minute sheet Component', () => {
    pickFirstMinuteSheet();
  });

  describe('Fill out minute sheet form', () => {
    it('Can see auto filled inputs in Metadata section', () => {
      // The select element should have a preselected value
      cy.get('#judge').contains('John O. Colvin');
      cy.get('#trialClerk').should('have.value', 'Test Trial Clerk');
    });

    it('Can fill out court reporter input and check remote session', () => {
      cy.get('#courtReporter').type('Test Court Reporter');
      cy.wait(500);
      cy.get('#courtReporter').should('have.value', 'Test Court Reporter');
    });
  });
});
