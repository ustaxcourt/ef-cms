import {
  createISODateString,
  formatDateString,
  FORMATS,
} from '@shared/business/utilities/DateHandler';
import { loginAsPetitionsClerk1 } from 'cypress/helpers/authentication/login-as-helpers';
import { createTrialSession } from 'cypress/helpers/trialSession/create-trial-session';

describe('Case Services Supervisor edits an ongoing trial session', () => {
  // beforeEach(() => {
  //   loginAsPetitionsClerk1();
  //   createTrialSession({
  //     startDate: formatDateString(createISODateString(), FORMATS.MMDDYYYY),
  //   }).then(({ trialSessionId }) => {
  //     cy.wrap(trialSessionId).as('trialSessionId');
  //   });
  // });
  it('disables certain components', () => {});
});
