import { fillInAndSubmitForm } from '../support/pages/start-a-case';
import {
  getCaseList,
  getStartCaseButton,
  navigateTo as navigateToDashboard,
} from '../support/pages/dashboard-practitioner';

describe('Start a case as a practitioner', () => {
  it('go to the practitioner dashboard, file a case, and expect case count to incrememt by one', () => {
    navigateToDashboard('privatepractitioner');

    getCaseList().then(cases => {
      getStartCaseButton().click();
      fillInAndSubmitForm();
      getCaseList().should('exist');
      getCaseList().should('have.length', cases.length + 1);
    });
  });
});
