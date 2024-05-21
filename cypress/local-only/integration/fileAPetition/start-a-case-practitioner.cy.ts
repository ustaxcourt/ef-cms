import { fillInAndSubmitForm } from '../../support/pages/start-a-case';
import {
  getCaseList,
  getStartCaseButton,
  navigateTo as navigateToDashboard,
} from '../../support/pages/dashboard-practitioner';

describe('Start a case as a practitioner', () => {
  before(() => {
    cy.task('toggleFeatureFlag', {
      flag: 'updated-petition-flow',
      flagValue: false,
    });

    cy.reload(true);
  });

  after(() => {
    cy.task('toggleFeatureFlag', {
      flag: 'updated-petition-flow',
      flagValue: true,
    });
  });

  it('go to the practitioner dashboard, file a case, and expect case count to incrememt by one', () => {
    navigateToDashboard('privatePractitioner');

    getCaseList().then(cases => {
      getStartCaseButton().click();
      fillInAndSubmitForm();
      getCaseList().should('exist');
      getCaseList().should('have.length', cases.length + 1);
    });
  });
});
