import {
  FORMATS,
  prepareDateFromString,
} from '../../shared/src/business/utilities/DateHandler';
import { docketClerkCreatesATrialSession } from './journey/docketClerkCreatesATrialSession';
import { docketClerkViewsNewTrialSession } from './journey/docketClerkViewsNewTrialSession';
import { docketClerkViewsTrialSessionList } from './journey/docketClerkViewsTrialSessionList';
import { formattedTrialSessionDetails } from '../src/presenter/computeds/formattedTrialSessionDetails';
import { loginAs, setupTest } from './helpers';
import { markAllCasesAsQCed } from './journey/markAllCasesAsQCed';
import { petitionsClerkSetsATrialSessionsSchedule } from './journey/petitionsClerkSetsATrialSessionsSchedule';
import { petitionsClerkViewsNewTrialSession } from './journey/petitionsClerkViewsNewTrialSession';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../src/withAppContext';

// create a trial session
// start date 30 days from now
// calendar it
// go back to the main trial session page
// assert that the trial session is showing the clock (helper?)
// assert the tooltip?
// login as docketclerk (non Petitions Clerk, CSS, or CotC)
// go into the trial session
// assert that the alert banner is there, but can't clear it
// login as petitionsClerk
// go into the trial session
// assert that the alert banner is there
// clear the alert
// assert the banner is success

describe('petitions clerk views NOTT reminder on calendared trial session within 30-35 day range', () => {
  const cerebralTest = setupTest();

  const trialLocation = `Denver, Colorado, ${Date.now()}`;

  const currentDate = prepareDateFromString().plus({
    ['days']: 30,
  });

  // trialDate should be 30 days from now
  const overrides = {
    maxCases: 2,
    preferredTrialCity: trialLocation,
    sessionType: 'Small',
    trialDay:
      currentDate.day.toString().length === 1
        ? '0' + currentDate.day
        : currentDate.day,
    trialLocation,
    trialMonth:
      currentDate.month.toString().length === 1
        ? '0' + currentDate.month
        : currentDate.month,
    trialYear: currentDate.year.toString(),
  };

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  describe(`Create trial session with Small session type for '${trialLocation}'`, () => {
    loginAs(cerebralTest, 'docketclerk@example.com');
    docketClerkCreatesATrialSession(cerebralTest, overrides);
    docketClerkViewsTrialSessionList(cerebralTest);
    // docketClerkViewsNewTrialSession(cerebralTest);
  });

  // describe('petitions clerk sets calendar for trial session', () => {
  //   petitionsClerkViewsNewTrialSession(cerebralTest);
  //   markAllCasesAsQCed(cerebralTest, () => [cerebralTest.docketNumber]);
  //   petitionsClerkSetsATrialSessionsSchedule(cerebralTest);

  //   it('petitions clerk should be redirected to print paper service for the trial session', () => {
  //     expect(cerebralTest.getState('currentPage')).toEqual(
  //       'PrintPaperTrialNotices',
  //     );
  //   });

  //   it('petitions clerk verifies that both cases were set on the trial session', async () => {
  //     await cerebralTest.runSequence('gotoTrialSessionDetailSequence', {
  //       trialSessionId: cerebralTest.trialSessionId,
  //     });

  //     const trialSessionFormatted = runCompute(
  //       withAppContextDecorator(formattedTrialSessionDetails),
  //       {
  //         state: cerebralTest.getState(),
  //       },
  //     );

  //     expect(trialSessionFormatted.openCases.length).toEqual(1);
  //   });
  // });
});
