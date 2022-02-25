import {
  CASE_STATUS_TYPES,
  COUNTRY_TYPES,
  SERVICE_INDICATOR_TYPES,
} from '../../shared/src/business/entities/EntityConstants';
import { addToTrialSessionModalHelper as addToTrialSessionModalHelperComputed } from '../src/presenter/computeds/addToTrialSessionModalHelper';
import { applicationContextForClient as applicationContext } from '../../shared/src/business/test/createTestApplicationContext';
import { docketClerkCreatesATrialSession } from './journey/docketClerkCreatesATrialSession';
import { docketClerkSetsCaseReadyForTrial } from './journey/docketClerkSetsCaseReadyForTrial';
import { loginAs, setupTest, uploadPetition, wait } from './helpers';
import { markAllCasesAsQCed } from './journey/markAllCasesAsQCed';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../src/withAppContext';

import { petitionsClerkSetsATrialSessionsSchedule } from './journey/petitionsClerkSetsATrialSessionsSchedule';
import { petitionsClerkSubmitsCaseToIrs } from './journey/petitionsClerkSubmitsCaseToIrs';

const cerebralTest = setupTest();
const { CASE_TYPES_MAP } = applicationContext.getConstants();

const addToTrialSessionModalHelper = withAppContextDecorator(
  addToTrialSessionModalHelperComputed,
);

//create an in person trial session
// create 4 cases - two paper + open,  one electronic + open, one closed
// update the open cases status to be ready for trial,
//add them to trial session
// complete QC and set calendar
//change trial session proceeding type to remote
//verify paper service page (number of pages based on number of paper cases)
//verify docket entry, served, etc

describe('Trial Session Eligible Cases Journey', () => {
  // beforeAll(() => {
  //   jest.setTimeout(30000);
  // });

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  const trialLocation = `Madison, Wisconsin, ${Date.now()}`;
  // eslint-disable-next-line @miovision/disallow-date/no-new-date
  const currentYearPlusFive = new Date().getFullYear() + 5;
  const overrides = {
    maxCases: 4,
    preferredTrialCity: trialLocation,
    sessionType: 'Small',
    trialLocation,
    trialYear: currentYearPlusFive.toString(),
  };
  const createdDocketNumbers = [];

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkCreatesATrialSession(cerebralTest, overrides);

  let caseOverrides = {
    ...overrides,
    caseType: CASE_TYPES_MAP.deficiency,
    contactPrimary: {
      address1: '734 Cowley Parkway',
      address2: 'Cum aut velit volupt',
      address3: 'Et sunt veritatis ei',
      city: 'Et id aut est velit',
      countryType: COUNTRY_TYPES.DOMESTIC,
      name: 'Mona Schultz',
      phone: '+1 (884) 358-9729',
      postalCode: '77546',
      serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
      state: 'CT',
    },
    procedureType: 'Small',
  };
  loginAs(cerebralTest, 'petitioner@example.com');
  it('Create case #1', async () => {
    const caseDetail = await uploadPetition(cerebralTest, caseOverrides);
    expect(caseDetail.docketNumber).toBeDefined();
    createdDocketNumbers.push(caseDetail.docketNumber);
    cerebralTest.docketNumber = caseDetail.docketNumber;
  });

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkSubmitsCaseToIrs(cerebralTest);

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkSetsCaseReadyForTrial(cerebralTest);

  caseOverrides = {
    ...overrides,
    caseType: CASE_TYPES_MAP.deficiency,
    contactPrimary: {
      address1: '734 Cowley Parkway',
      address2: 'Cum aut velit volupt',
      address3: 'Et sunt veritatis ei',
      city: 'Et id aut est velit',
      countryType: COUNTRY_TYPES.DOMESTIC,
      name: 'Mona Schultz',
      phone: '+1 (884) 358-9729',
      postalCode: '77546',
      serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
      state: 'CT',
    },
    procedureType: 'Small',
  };

  loginAs(cerebralTest, 'petitioner@example.com');
  it('Create case #2', async () => {
    const caseDetail = await uploadPetition(cerebralTest, caseOverrides);
    expect(caseDetail.docketNumber).toBeDefined();
    createdDocketNumbers.push(caseDetail.docketNumber);
    cerebralTest.docketNumber = caseDetail.docketNumber;
  });

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkSubmitsCaseToIrs(cerebralTest);

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkSetsCaseReadyForTrial(cerebralTest);

  caseOverrides = {
    ...overrides,
    caseType: CASE_TYPES_MAP.deficiency,
    procedureType: 'Small',
  };
  loginAs(cerebralTest, 'petitioner@example.com');
  it('Create case #3', async () => {
    const caseDetail = await uploadPetition(cerebralTest, caseOverrides);
    expect(caseDetail.docketNumber).toBeDefined();
    createdDocketNumbers.push(caseDetail.docketNumber);
    cerebralTest.docketNumber = caseDetail.docketNumber;
  });

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkSubmitsCaseToIrs(cerebralTest);

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkSetsCaseReadyForTrial(cerebralTest);

  caseOverrides = {
    ...overrides,
    caseType: CASE_TYPES_MAP.cdp,
    closedDate: Date.now(),
    procedureType: 'Small',
    status: CASE_STATUS_TYPES.closed,
  };
  loginAs(cerebralTest, 'petitioner@example.com');
  it('Create case #4', async () => {
    const caseDetail = await uploadPetition(cerebralTest, caseOverrides);
    expect(caseDetail.docketNumber).toBeDefined();
    createdDocketNumbers.push(caseDetail.docketNumber);
    cerebralTest.docketNumber = caseDetail.docketNumber;
  });

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkSubmitsCaseToIrs(cerebralTest);

  it('Petitions clerk should add cases to trial session', async () => {
    for (const docketNumber of createdDocketNumbers) {
      await cerebralTest.runSequence('gotoCaseDetailSequence', {
        docketNumber,
      });

      await cerebralTest.runSequence('openAddToTrialModalSequence');

      let modalHelper = await runCompute(addToTrialSessionModalHelper, {
        state: cerebralTest.getState(),
      });

      expect(modalHelper.showSessionNotSetAlert).toEqual(false);

      await cerebralTest.runSequence('updateModalValueSequence', {
        key: 'showAllLocations',
        value: true,
      });

      modalHelper = await runCompute(addToTrialSessionModalHelper, {
        state: cerebralTest.getState(),
      });

      expect(modalHelper.trialSessionStatesSorted[0]).toEqual('Remote');
      expect(modalHelper.trialSessionStatesSorted[1]).toEqual('Alabama');

      await cerebralTest.runSequence('updateModalValueSequence', {
        key: 'trialSessionId',
        value: cerebralTest.trialSessionId,
      });

      // Because the selected trial session is not yet calendared, we should show
      // the alert in the UI stating so.
      modalHelper = await runCompute(addToTrialSessionModalHelper, {
        state: cerebralTest.getState(),
      });

      expect(modalHelper.showSessionNotSetAlert).toEqual(true);

      await cerebralTest.runSequence('addCaseToTrialSessionSequence');
      await wait(1000);

      const trialSessionJudge = cerebralTest.getState('trialSessionJudge');
      expect(trialSessionJudge).toMatchObject(
        expect.objectContaining({
          name: expect.anything(),
          userId: expect.anything(),
        }),
      );
    }
  });

  describe('Calendar clerk marks all eligible cases as QCed', () => {
    loginAs(cerebralTest, 'petitionsclerk@example.com');
    markAllCasesAsQCed(cerebralTest, () => [
      createdDocketNumbers[0],
      createdDocketNumbers[1],
      createdDocketNumbers[2],
      createdDocketNumbers[3],
    ]);
  });

  describe(`Set calendar for '${trialLocation}' session`, () => {
    loginAs(cerebralTest, 'petitionsclerk@example.com');
    petitionsClerkSetsATrialSessionsSchedule(cerebralTest);
  });

  // describe(`Result: Case #4, #5, and #1 are assigned to '${trialLocation}' session and their case statuses are updated to “Calendared for Trial”`, () => {
  //   loginAs(cerebralTest, 'petitionsclerk@example.com');

  //   it(`Case #4, #5, and #1 are assigned to '${trialLocation}' session`, async () => {
  //     await cerebralTest.runSequence('gotoTrialSessionDetailSequence', {
  //       trialSessionId: cerebralTest.trialSessionId,
  //     });

  //     expect(
  //       cerebralTest.getState('trialSession.calendaredCases').length,
  //     ).toEqual(3);
  //     expect(cerebralTest.getState('trialSession.isCalendared')).toEqual(true);
  //     expect(
  //       cerebralTest.getState('trialSession.calendaredCases.0.docketNumber'),
  //     ).toEqual(createdDocketNumbers[3]);
  //     expect(
  //       cerebralTest.getState('trialSession.calendaredCases.1.docketNumber'),
  //     ).toEqual(createdDocketNumbers[4]);
  //     // this could be either case 0 or 1 depending on which was marked eligible first
  //     expect(
  //       cerebralTest.getState('trialSession.calendaredCases.2.docketNumber'),
  //     ).toEqual(createdDocketNumbers[0]);
  //   });

  //   it(`Case #4, #5, and #1 are assigned to '${trialLocation}' session; Case #2 and #3 are not assigned`, async () => {
  //     //Case #1 - assigned
  //     await cerebralTest.runSequence('gotoCaseDetailSequence', {
  //       docketNumber: createdDocketNumbers[0],
  //     });
  //     expect(cerebralTest.getState('caseDetail.status')).toEqual(
  //       STATUS_TYPES.calendared,
  //     );
  //     expect(cerebralTest.getState('caseDetail.trialLocation')).toEqual(
  //       trialLocation,
  //     );
  //     expect(cerebralTest.getState('caseDetail.trialDate')).toEqual(
  //       '2025-12-12T05:00:00.000Z',
  //     );
  //     expect(cerebralTest.getState('caseDetail.associatedJudge')).toEqual(
  //       'Cohen',
  //     );

  //     //Case #2 - not assigned
  //     await cerebralTest.runSequence('gotoCaseDetailSequence', {
  //       docketNumber: createdDocketNumbers[1],
  //     });
  //     expect(cerebralTest.getState('caseDetail.status')).not.toEqual(
  //       STATUS_TYPES.calendared,
  //     );
  //     expect(cerebralTest.getState('caseDetail.trialLocation')).toBeUndefined();
  //     expect(cerebralTest.getState('caseDetail.trialDate')).toBeUndefined();
  //     expect(cerebralTest.getState('caseDetail.associatedJudge')).toEqual(
  //       CHIEF_JUDGE,
  //     );

  //     //Case #3 - not assigned
  //     await cerebralTest.runSequence('gotoCaseDetailSequence', {
  //       docketNumber: createdDocketNumbers[2],
  //     });
  //     expect(cerebralTest.getState('caseDetail.status')).not.toEqual(
  //       STATUS_TYPES.calendared,
  //     );

  //     //Case #4 - assigned
  //     await cerebralTest.runSequence('gotoCaseDetailSequence', {
  //       docketNumber: createdDocketNumbers[3],
  //     });
  //     expect(cerebralTest.getState('caseDetail.status')).toEqual(
  //       STATUS_TYPES.calendared,
  //     );

  //     //Case #5 - assigned
  //     await cerebralTest.runSequence('gotoCaseDetailSequence', {
  //       docketNumber: createdDocketNumbers[4],
  //     });
  //     expect(cerebralTest.getState('caseDetail.status')).toEqual(
  //       STATUS_TYPES.calendared,
  //     );
  //   });

  //   it(`verify case #1 can be manually removed from '${trialLocation}' session`, async () => {
  //     await cerebralTest.runSequence('gotoCaseDetailSequence', {
  //       docketNumber: createdDocketNumbers[0],
  //     });

  //     await cerebralTest.runSequence('removeCaseFromTrialSequence');

  //     expect(cerebralTest.getState('validationErrors')).toEqual({
  //       caseStatus: 'Enter a case status',
  //       disposition: 'Enter a disposition',
  //     });

  //     await cerebralTest.runSequence(
  //       'openRemoveFromTrialSessionModalSequence',
  //       {
  //         trialSessionId: cerebralTest.trialSessionId,
  //       },
  //     );

  //     await cerebralTest.runSequence('updateModalValueSequence', {
  //       key: 'disposition',
  //       value: 'testing',
  //     });

  //     await cerebralTest.runSequence('removeCaseFromTrialSequence');

  //     expect(cerebralTest.getState('validationErrors')).toEqual({});

  //     await cerebralTest.runSequence('gotoCaseDetailSequence', {
  //       docketNumber: createdDocketNumbers[0],
  //     });
  //     expect(cerebralTest.getState('caseDetail.status')).not.toEqual(
  //       STATUS_TYPES.calendared,
  //     );

  //     await cerebralTest.runSequence('gotoTrialSessionDetailSequence', {
  //       trialSessionId: cerebralTest.trialSessionId,
  //     });

  //     expect(
  //       cerebralTest.getState(
  //         'trialSession.calendaredCases.2.removedFromTrial',
  //       ),
  //     ).toBeTruthy();
  //   });

  //   it(`verify case #1 can be manually added back to the '${trialLocation}' session`, async () => {
  //     await cerebralTest.runSequence('gotoCaseDetailSequence', {
  //       docketNumber: createdDocketNumbers[0],
  //     });
  //     expect(cerebralTest.getState('caseDetail.status')).not.toEqual(
  //       STATUS_TYPES.calendared,
  //     );

  //     await cerebralTest.runSequence('openAddToTrialModalSequence');
  //     await cerebralTest.runSequence('addCaseToTrialSessionSequence');
  //     await wait(1000);

  //     expect(cerebralTest.getState('validationErrors')).toEqual({
  //       trialSessionId: 'Select a Trial Session',
  //     });

  //     await cerebralTest.runSequence('openAddToTrialModalSequence');
  //     cerebralTest.setState(
  //       'modal.trialSessionId',
  //       cerebralTest.trialSessionId,
  //     );

  //     await cerebralTest.runSequence('addCaseToTrialSessionSequence');
  //     await wait(1000); // we need to wait for some reason

  //     expect(cerebralTest.getState('validationErrors')).toEqual({});

  //     await cerebralTest.runSequence('gotoCaseDetailSequence', {
  //       docketNumber: createdDocketNumbers[0],
  //     });
  //     expect(cerebralTest.getState('caseDetail.status')).toEqual(
  //       STATUS_TYPES.calendared,
  //     );

  //     await cerebralTest.runSequence('gotoTrialSessionDetailSequence', {
  //       trialSessionId: cerebralTest.trialSessionId,
  //     });

  //     expect(
  //       cerebralTest.getState(
  //         'trialSession.calendaredCases.2.removedFromTrial',
  //       ),
  //     ).toBeFalsy();

  //     expect(
  //       cerebralTest.getState('trialSession.calendaredCases.2.isManuallyAdded'),
  //     ).toBeTruthy();
  //   });
  // });
});
