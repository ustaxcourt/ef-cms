import { fillInAndSubmitForm } from '../support/pages/start-a-case';
import {
  getCaseList,
  getStartCaseButton,
  navigateTo as navigateToDashboard,
} from '../support/pages/dashboard-practitioner';

describe('Start a case as a practitioner', () => {
  it('go to the practitioner dashboard and expect that a case list table is displayed with eight cases', () => {
    navigateToDashboard('privatepractitioner');
    getCaseList().should('have.length', 8);
  });

  it('click the start a case button', () => {
    getStartCaseButton().click();
  });

  it('fills in the start a case form', () => {
    fillInAndSubmitForm();
  });

  it('expect the case list to be displayed with nine items now', () => {
    getCaseList().should('exist');
    getCaseList().should('have.length', 9);
  });
});
