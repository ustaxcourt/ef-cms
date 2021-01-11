import { docketClerkCreatesATrialSession } from './journey/docketClerkCreatesATrialSession';
import { docketClerkEditsTrialSession } from './journey/docketClerkEditsTrialSession';
import { docketClerkUpdatesCaseStatusToClosed } from './journey/docketClerkUpdatesCaseStatusToClosed';
import { docketClerkViewsTrialSessionList } from './journey/docketClerkViewsTrialSessionList';
import { loginAs, setupTest, uploadPetition } from './helpers';
import { petitionsClerkManuallyAddsCaseToTrial } from './journey/petitionsClerkManuallyAddsCaseToTrial';
import { petitionsClerkSetsATrialSessionsSchedule } from './journey/petitionsClerkSetsATrialSessionsSchedule';

const test = setupTest();

describe('Docket Clerk edits a calendared trial session', () => {
  beforeEach(() => {
    jest.setTimeout(30000);
  });

  const trialLocation = `Helena, Montana, ${Date.now()}`;

  loginAs(test, 'docketclerk@example.com');
  docketClerkCreatesATrialSession(test, {
    trialLocation,
  });
  docketClerkViewsTrialSessionList(test, {
    trialLocation,
  });

  let caseDetail;
  test.casesReadyForTrial = [];

  for (let i = 0; i < 3; i++) {
    loginAs(test, 'petitioner@example.com');
    it('login as a petitioner and create 3 cases', async () => {
      caseDetail = await uploadPetition(test);
      expect(caseDetail.docketNumber).toBeDefined();
      test.casesReadyForTrial.push({ docketNumber: caseDetail.docketNumber });
      test.docketNumber = caseDetail.docketNumber;
    });

    loginAs(test, 'petitionsclerk@example.com');
    petitionsClerkManuallyAddsCaseToTrial(test);
  }

  petitionsClerkSetsATrialSessionsSchedule(test);

  loginAs(test, 'docketclerk@example.com');
  docketClerkUpdatesCaseStatusToClosed(test);

  const overrides = {
    fieldToUpdate: 'judge',
    valueToUpdate: {
      name: 'Gustafson',
      userId: 'dabbad05-18d0-43ec-bafb-654e83405416',
    },
  };

  docketClerkEditsTrialSession(test, {
    fieldToUpdate: 'judge',
    valueToUpdate: {
      name: 'Gustafson',
      userId: 'dabbad05-18d0-43ec-bafb-654e83405416',
    },
  });

  //expcet the closed case should have the updated judge, should not be calendared
  // docketClerkVerifiesCaseStatusRemainsUnchanged(test);
});
