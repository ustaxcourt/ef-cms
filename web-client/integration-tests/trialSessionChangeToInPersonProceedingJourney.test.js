// import {
//   CASE_STATUS_TYPES,
//   CASE_TYPES_MAP,
//   COUNTRY_TYPES,
//   SERVICE_INDICATOR_TYPES,
//   SYSTEM_GENERATED_DOCUMENT_TYPES,
//   TRIAL_SESSION_PROCEEDING_TYPES,
// } from '../../shared/src/business/entities/EntityConstants';
// import { addToTrialSessionModalHelper as addToTrialSessionModalHelperComputed } from '../src/presenter/computeds/addToTrialSessionModalHelper';
// import { docketClerkCreatesARemoteTrialSession } from './journey/docketClerkCreatesARemoteTrialSession';
// import { docketClerkSetsCaseReadyForTrial } from './journey/docketClerkSetsCaseReadyForTrial';
// import {
//   loginAs,
//   refreshElasticsearchIndex,
//   setupTest,
//   uploadPetition,
//   wait,
//   waitForExpectedItem,
//   waitForLoadingComponentToHide,
// } from './helpers';
// import { markAllCasesAsQCed } from './journey/markAllCasesAsQCed';
// import { petitionsClerkSetsATrialSessionsSchedule } from './journey/petitionsClerkSetsATrialSessionsSchedule';
// import { petitionsClerkSubmitsCaseToIrs } from './journey/petitionsClerkSubmitsCaseToIrs';
// import { runCompute } from 'cerebral/test';
// import { withAppContextDecorator } from '../src/withAppContext';

// describe('Trial Session Eligible Cases Journey', () => {
//   const cerebralTest = setupTest();

//   afterAll(() => {
//     cerebralTest.closeSocket();
//   });

//   const addToTrialSessionModalHelper = withAppContextDecorator(
//     addToTrialSessionModalHelperComputed,
//   );

//   const trialLocation = `Madison, Wisconsin, ${Date.now()}`;
//   // eslint-disable-next-line @miovision/disallow-date/no-new-date
//   const currentYearPlusFive = new Date().getFullYear() + 5;
//   const overrides = {
//     maxCases: 4,
//     preferredTrialCity: trialLocation,
//     proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.remote,
//     sessionType: 'Small',
//     trialLocation,
//     trialYear: currentYearPlusFive.toString(),
//   };
//   const createdDocketNumbers = [];

//   loginAs(cerebralTest, 'docketclerk@example.com');
//   docketClerkCreatesARemoteTrialSession(cerebralTest);

//   let caseOverrides;

//   loginAs(cerebralTest, 'petitioner@example.com');
//   it('Create case #1', async () => {
//     caseOverrides = {
//       ...overrides,
//       caseType: CASE_TYPES_MAP.deficiency,
//       contactPrimary: {
//         address1: '734 Cowley Parkway',
//         address2: 'Cum aut velit volupt',
//         address3: 'Et sunt veritatis ei',
//         city: 'Et id aut est velit',
//         countryType: COUNTRY_TYPES.DOMESTIC,
//         name: 'Mona Schultz',
//         phone: '1 (884) 358-9729',
//         postalCode: '77546',
//         serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
//         state: 'CT',
//       },
//       procedureType: 'Small',
//     };
//     const caseDetail = await uploadPetition(cerebralTest, caseOverrides);
//     expect(caseDetail.docketNumber).toBeDefined();
//     createdDocketNumbers.push(caseDetail.docketNumber);
//     cerebralTest.docketNumber = caseDetail.docketNumber;
//   });

//   loginAs(cerebralTest, 'petitionsclerk@example.com');
//   petitionsClerkSubmitsCaseToIrs(cerebralTest);

//   loginAs(cerebralTest, 'docketclerk@example.com');
//   docketClerkSetsCaseReadyForTrial(cerebralTest);

//   loginAs(cerebralTest, 'petitioner@example.com');
//   it('Create case #2', async () => {
//     caseOverrides = {
//       ...overrides,
//       caseType: CASE_TYPES_MAP.deficiency,
//       contactPrimary: {
//         address1: '734 Cowley Parkway',
//         address2: 'Cum aut velit volupt',
//         address3: 'Et sunt veritatis ei',
//         city: 'Et id aut est velit',
//         countryType: COUNTRY_TYPES.DOMESTIC,
//         name: 'Mona Schultz',
//         phone: '1 (884) 358-9729',
//         postalCode: '77546',
//         serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
//         state: 'CT',
//       },
//       procedureType: 'Small',
//     };

//     const caseDetail = await uploadPetition(cerebralTest, caseOverrides);
//     expect(caseDetail.docketNumber).toBeDefined();
//     createdDocketNumbers.push(caseDetail.docketNumber);
//     cerebralTest.docketNumber = caseDetail.docketNumber;
//   });

//   loginAs(cerebralTest, 'petitionsclerk@example.com');
//   petitionsClerkSubmitsCaseToIrs(cerebralTest);

//   loginAs(cerebralTest, 'docketclerk@example.com');
//   docketClerkSetsCaseReadyForTrial(cerebralTest);

//   caseOverrides = {
//     ...overrides,
//     caseType: CASE_TYPES_MAP.deficiency,
//     procedureType: 'Small',
//   };
//   loginAs(cerebralTest, 'petitioner@example.com');
//   it('Create case #3', async () => {
//     const caseDetail = await uploadPetition(cerebralTest, caseOverrides);
//     expect(caseDetail.docketNumber).toBeDefined();
//     createdDocketNumbers.push(caseDetail.docketNumber);
//     cerebralTest.docketNumber = caseDetail.docketNumber;
//   });

//   loginAs(cerebralTest, 'petitionsclerk@example.com');
//   petitionsClerkSubmitsCaseToIrs(cerebralTest);

//   loginAs(cerebralTest, 'docketclerk@example.com');
//   docketClerkSetsCaseReadyForTrial(cerebralTest);

//   loginAs(cerebralTest, 'petitioner@example.com');
//   it('Create case #4', async () => {
//     caseOverrides = {
//       ...overrides,
//       caseType: CASE_TYPES_MAP.cdp,
//       closedDate: Date.now(),
//       procedureType: 'Small',
//       status: CASE_STATUS_TYPES.closed,
//     };
//     const caseDetail = await uploadPetition(cerebralTest, caseOverrides);
//     expect(caseDetail.docketNumber).toBeDefined();
//     createdDocketNumbers.push(caseDetail.docketNumber);
//     cerebralTest.docketNumber = caseDetail.docketNumber;
//   });

//   loginAs(cerebralTest, 'petitionsclerk@example.com');
//   petitionsClerkSubmitsCaseToIrs(cerebralTest);

//   it('Petitions clerk should add cases to trial session', async () => {
//     for (const docketNumber of createdDocketNumbers) {
//       await cerebralTest.runSequence('gotoCaseDetailSequence', {
//         docketNumber,
//       });

//       await cerebralTest.runSequence('openAddToTrialModalSequence');

//       let modalHelper = await runCompute(addToTrialSessionModalHelper, {
//         state: cerebralTest.getState(),
//       });

//       expect(modalHelper.showSessionNotSetAlert).toEqual(false);

//       await cerebralTest.runSequence('updateModalValueSequence', {
//         key: 'showAllLocations',
//         value: true,
//       });

//       modalHelper = await runCompute(addToTrialSessionModalHelper, {
//         state: cerebralTest.getState(),
//       });

//       expect(modalHelper.trialSessionStatesSorted[0]).toEqual('Remote');
//       expect(modalHelper.trialSessionStatesSorted[1]).toEqual('Alabama');

//       await cerebralTest.runSequence('updateModalValueSequence', {
//         key: 'trialSessionId',
//         value: cerebralTest.trialSessionId,
//       });

//       await cerebralTest.runSequence('addCaseToTrialSessionSequence');
//       await wait(1000);

//       const trialSessionJudge = cerebralTest.getState('trialSessionJudge');
//       expect(trialSessionJudge).toMatchObject(
//         expect.objectContaining({
//           name: expect.anything(),
//           userId: expect.anything(),
//         }),
//       );
//     }
//   });

//   describe('Calendar clerk marks all eligible cases as QCed', () => {
//     markAllCasesAsQCed(cerebralTest, () => [
//       createdDocketNumbers[0],
//       createdDocketNumbers[1],
//       createdDocketNumbers[2],
//       createdDocketNumbers[3],
//     ]);
//   });

//   describe(`Set calendar for '${trialLocation}' session`, () => {
//     loginAs(cerebralTest, 'petitionsclerk@example.com');
//     petitionsClerkSetsATrialSessionsSchedule(cerebralTest);
//   });

//   it('Petitions clerk edits a remote trial session to be in person', async () => {
//     await cerebralTest.runSequence('gotoEditTrialSessionSequence', {
//       trialSessionId: cerebralTest.trialSessionId,
//     });

//     await cerebralTest.runSequence('updateTrialSessionFormDataSequence', {
//       key: 'proceedingType',
//       value: TRIAL_SESSION_PROCEEDING_TYPES.inPerson,
//     });

//     await cerebralTest.runSequence('updateTrialSessionSequence');

//     expect(cerebralTest.getState('validationErrors')).toEqual({});

//     await waitForLoadingComponentToHide({ cerebralTest });
//     await waitForExpectedItem({
//       cerebralTest,
//       currentItem: 'currentPage',
//       expectedItem: 'PrintPaperTrialNotices',
//     });
//     expect(cerebralTest.getState('currentPage')).toBe('PrintPaperTrialNotices');
//   });

//   loginAs(cerebralTest, 'petitionsclerk@example.com');
//   it('Petitions clerk verifies NOIP docket entries for open cases', async () => {
//     await refreshElasticsearchIndex();

//     for (const docketNumberToSearch of createdDocketNumbers) {
//       await cerebralTest.runSequence('gotoCaseDetailSequence', {
//         docketNumber: docketNumberToSearch,
//       });

//       expect(cerebralTest.getState('currentPage')).toEqual(
//         'CaseDetailInternal',
//       );

//       const caseDetail = cerebralTest.getState('caseDetail');

//       const noipDocketEntry = caseDetail.docketEntries.find(
//         ({ eventCode }) =>
//           eventCode ===
//           SYSTEM_GENERATED_DOCUMENT_TYPES.noticeOfChangeToInPersonProceeding
//             .eventCode,
//       );

//       await waitForLoadingComponentToHide({ cerebralTest });
//       if (caseDetail.status !== CASE_STATUS_TYPES.closed) {
//         expect(noipDocketEntry).toMatchObject({
//           servedParties: [
//             {
//               name: 'Mona Schultz',
//             },
//           ],
//         });
//       } else {
//         expect(noipDocketEntry).toBeUndefined();
//       }
//     }
//   });
// });

import {
  SYSTEM_GENERATED_DOCUMENT_TYPES,
  TRIAL_SESSION_PROCEEDING_TYPES,
} from '../../shared/src/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '../../shared/src/business/test/createTestApplicationContext';
import { docketClerkCreatesARemoteTrialSession } from './journey/docketClerkCreatesARemoteTrialSession';
import { docketClerkSetsCaseReadyForTrial } from './journey/docketClerkSetsCaseReadyForTrial';
import { docketClerkViewsTrialSessionList } from './journey/docketClerkViewsTrialSessionList';
import {
  fakeFile,
  loginAs,
  refreshElasticsearchIndex,
  setupTest,
  uploadPetition,
  waitForExpectedItem,
  waitForLoadingComponentToHide,
} from './helpers';
import { formattedTrialSessionDetails } from '../src/presenter/computeds/formattedTrialSessionDetails';
import { manuallyAddCaseToTrial } from './utils/manuallyAddCaseToTrial';
import { petitionsClerkCreatesNewCase } from './journey/petitionsClerkCreatesNewCase';
import { petitionsClerkSubmitsCaseToIrs } from './journey/petitionsClerkSubmitsCaseToIrs.js';
import { petitionsClerkViewsOpenTrialSession } from './journey/petitionsClerkViewsOpenTrialSession';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../src/withAppContext';

const cerebralTest = setupTest();

describe('petitions clerk sets a remote trial session calendar', () => {
  const { CASE_TYPES_MAP } = applicationContext.getConstants();
  const trialLocation = `Denver, Colorado, ${Date.now()}`;
  const overrides = {
    maxCases: 2,
    preferredTrialCity: trialLocation,
    sessionType: 'Small',
    trialLocation,
  };

  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkCreatesARemoteTrialSession(cerebralTest, overrides);
  docketClerkViewsTrialSessionList(cerebralTest);

  const caseOverrides = {
    ...overrides,
    caseType: CASE_TYPES_MAP.cdp,
    procedureType: 'Small',
  };

  loginAs(cerebralTest, 'petitioner@example.com');
  it('create case and set ready for trial', async () => {
    const caseDetail = await uploadPetition(cerebralTest, caseOverrides);
    expect(caseDetail.docketNumber).toBeDefined();
    cerebralTest.docketNumber = caseDetail.docketNumber;
  });

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkSubmitsCaseToIrs(cerebralTest);

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkSetsCaseReadyForTrial(cerebralTest);
  manuallyAddCaseToTrial(cerebralTest);

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  it('Petitions clerk edits a remote trial session to be in person', async () => {
    await cerebralTest.runSequence('gotoEditTrialSessionSequence', {
      trialSessionId: cerebralTest.trialSessionId,
    });

    await cerebralTest.runSequence('updateTrialSessionFormDataSequence', {
      key: 'proceedingType',
      value: TRIAL_SESSION_PROCEEDING_TYPES.inPerson,
    });

    await cerebralTest.runSequence('updateTrialSessionSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({});

    await waitForLoadingComponentToHide({ cerebralTest });
    await waitForExpectedItem({
      cerebralTest,
      currentItem: 'currentPage',
      expectedItem: 'TrialSessionDetail',
    });
    expect(cerebralTest.getState('currentPage')).toBe('TrialSessionDetail');
  });

  it('Petitions clerk verifies NOIP docket entries for open cases', async () => {
    await refreshElasticsearchIndex();

    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    expect(cerebralTest.getState('currentPage')).toEqual('CaseDetailInternal');

    const caseDetail = cerebralTest.getState('caseDetail');

    const noipDocketEntry = caseDetail.docketEntries.find(
      ({ eventCode }) =>
        eventCode ===
        SYSTEM_GENERATED_DOCUMENT_TYPES.noticeOfChangeToInPersonProceeding
          .eventCode,
    );

    await waitForLoadingComponentToHide({ cerebralTest });
    expect(noipDocketEntry).toMatchObject({
      servedParties: [
        {
          name: 'Mona Schultz',
        },
      ],
    });
  });
});
