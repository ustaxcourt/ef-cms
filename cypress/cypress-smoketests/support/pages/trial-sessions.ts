import { faker } from '@faker-js/faker';

faker.seed(faker.number.int());

export const goToTrialSessions = () => {
  cy.get('a[href="/trial-sessions"]').click();
  cy.waitUntilSettled(50);
  cy.get('h1').contains('Trial Sessions').should('exist');
};

export const goToCreateTrialSession = () => {
  cy.get('a[href="/add-a-trial-session"]').click();
  cy.waitUntilSettled(50);
  cy.get('h1').contains('Create Trial Session').should('exist');
  cy.waitUntilSettled(50);
};

export const createTrialSession = (testData, overrides = {}) => {
  const createFutureDate = () => {
    const month = faker.number.int({ max: 12, min: 1 });
    const day = faker.number.int({ max: 28, min: 1 });
    const year =
      // disabled because we're generating a random year for testing.
      // eslint-disable-next-line @miovision/disallow-date/no-new-date
      new Date().getUTCFullYear() + faker.number.int({ max: 5, min: 1 });
    return `${month}/${day}/${year}`;
  };

  // session information
  cy.get('#start-date-picker').type(createFutureDate());
  cy.get('#start-time-hours').clear();
  cy.get('#start-time-hours').type(`${faker.number.int({ max: 11, min: 6 })}`);
  cy.get('#start-time-minutes').clear();
  cy.get('#start-time-minutes').type(
    faker.helpers.arrayElement(['00', '15', '30', '45']),
  );
  cy.get('label[for="startTimeExtension-pm"]').click();
  cy.get('label[for="session-type-Hybrid"]').click();
  cy.get('#max-cases').type(`${faker.number.int({ max: 100, min: 10 })}`);

  // location information
  cy.get('#inPerson-proceeding-label').click();
  cy.get('#trial-location').select(testData.preferredTrialCity);
  cy.get('#courthouse-name').type(faker.commerce.productName());
  cy.get('#address1').type(faker.location.streetAddress());
  cy.get('#city').type(faker.location.city());
  cy.get('#state').select(faker.location.stateAbbr());
  cy.get('#postal-code').type(faker.location.zipCode());

  // session assignments
  cy.get('#judgeId').select(testData.judgeName || 'Foley');
  cy.get(`#judgeId option:contains(${overrides.offboardedJudge})`).should(
    'not.exist',
  );

  cy.get('#chambers-phone-number').type(faker.phone.number());
  cy.get('#trial-clerk').select(testData.trialClerk || 'Test trialclerk1');
  cy.get('#court-reporter').type(faker.person.fullName());
  cy.get('#irs-calendar-administrator').type(faker.person.fullName());
  cy.get('#notes').type(faker.company.catchPhrase());

  cy.get('#submit-trial-session').click();

  // set up listener for POST call, get trialSessionId
  cy.wait('@postTrialSession').then(({ response }) => {
    const { trialSessionId } = response.body;
    testData.trialSessionIds.push(trialSessionId);
    cy.get('#new-trial-sessions-tab').click();
    cy.get(`a[href="/trial-session-detail/${trialSessionId}"]`).should('exist');
  });
};

export const goToTrialSession = (trialSessionId: string) => {
  cy.goToRoute(`/trial-session-detail/${trialSessionId}`);
  cy.get('.big-blue-header').should('exist');
};

export const setTrialSessionAsCalendared = (trialSessionId: string) => {
  cy.goToRoute(`/trial-session-detail/${trialSessionId}`);
  cy.get('#set-calendar-button').should('exist').click();
  cy.get('#modal-root .modal-button-confirm').click();
  cy.get('#set-calendar-button').should('not.exist');
  cy.get('.progress-indicator').should('not.exist');
};

export const markCaseAsQcCompleteForTrial = (docketNumber: string) => {
  cy.get(`#upcoming-sessions label[for="${docketNumber}-complete"]`).click();
};

export const verifyOpenCaseOnTrialSession = (docketNumber: string) => {
  cy.get(
    `#open-cases-tab-content a[href="/case-detail/${docketNumber}"]`,
  ).should('exist');
};

export const goToTrialSessionWorkingCopy = ({
  docketNumbers,
  judgeName,
  trialSessionId,
}) => {
  cy.goToRoute(`/trial-session-working-copy/${trialSessionId}`);
  cy.get(`h2:contains("${judgeName} - Session Copy")`).should('exist');
  docketNumbers.forEach(docketNumber => {
    cy.get(`a[href="/case-detail/${docketNumber}"]`).should('exist');
  });
};

export const changeCaseTrialStatus = (
  docketNumber,
  status = 'Set for Trial',
) => {
  cy.get(`#trialSessionWorkingCopy-${docketNumber}`).select(status);
};

export const checkShowAllFilterOnWorkingCopy = trialSessionId => {
  cy.goToRoute(`/trial-session-working-copy/${trialSessionId}`);
  cy.get('label[for="filters.showAll"]').click();
};

export const filterWorkingCopyByStatus = ({
  docketNumberShouldExist,
  docketNumberShouldNotExist,
  status,
}) => {
  cy.get(`label:contains("${status}")`).click();
  cy.get(`#trialSessionWorkingCopy-${docketNumberShouldExist}`).should('exist');
  cy.get(`#trialSessionWorkingCopy-${docketNumberShouldNotExist}`).should(
    'not.exist',
  );
};

export const addCaseNote = (docketNumber, note) => {
  cy.get('.no-wrap button:contains("Add Note")').click(); //TODO #add-note-${docketNumber}
  cy.get(`h5:contains("Docket ${docketNumber}")`).should('exist');
  cy.get('#case-notes').type(note);
  cy.get('#confirm').click();
  cy.get(`span:contains("${note}")`).should('exist');
};
