import { docketClerkAddsCaseToHearing } from './journey/docketClerkAddsCaseToHearing';
import { docketClerkCreatesATrialSession } from './journey/docketClerkCreatesATrialSession';
import { docketClerkEditsHearingNote } from './journey/docketClerkEditsHearingNote';
import { docketClerkManuallyAddsCaseToTrialSessionWithNote } from './journey/docketClerkManuallyAddsCaseToTrialSessionWithNote';
import { docketClerkRemovesCaseFromHearing } from './journey/docketClerkRemovesCaseFromHearing';
import { docketClerkViewsNewTrialSession } from './journey/docketClerkViewsNewTrialSession';
import { docketClerkViewsTrialSessionList } from './journey/docketClerkViewsTrialSessionList';
import { judgeViewsTrialSessionWorkingCopy } from './journey/judgeViewsTrialSessionWorkingCopy';
import { petitionsClerkBlocksCase } from './journey/petitionsClerkBlocksCase';
import { petitionsClerkPrioritizesCase } from './journey/petitionsClerkPrioritizesCase';

import { loginAs, setupTest, uploadPetition } from './helpers';

const cerebralTest = setupTest();

describe('trial hearings journey', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  const trialLocation1 = `Denver, Colorado, ${Date.now()}`;
  const overrides1 = {
    maxCases: 3,
    preferredTrialCity: trialLocation1,
    sessionType: 'Small',
    trialLocation: trialLocation1,
  };
  const trialLocation2 = `Biloxi, Mississippi, ${Date.now()}`;
  const overrides2 = {
    maxCases: 3,
    preferredTrialCity: trialLocation2,
    sessionType: 'Small',
    trialLocation: trialLocation2,
  };
  cerebralTest.createdTrialSessions = [];
  cerebralTest.createdCases = [];

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkCreatesATrialSession(cerebralTest, overrides1);
  docketClerkViewsTrialSessionList(cerebralTest);
  docketClerkViewsNewTrialSession(cerebralTest);
  docketClerkCreatesATrialSession(cerebralTest, overrides2);
  docketClerkViewsTrialSessionList(cerebralTest);
  docketClerkViewsNewTrialSession(cerebralTest);

  loginAs(cerebralTest, 'petitioner@example.com');
  it('create case 1', async () => {
    const caseDetail = await uploadPetition(cerebralTest, overrides1);
    expect(caseDetail.docketNumber).toBeDefined();
    cerebralTest.docketNumber = caseDetail.docketNumber;
    cerebralTest.createdCases.push(cerebralTest.docketNumber);
  });

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkManuallyAddsCaseToTrialSessionWithNote(cerebralTest);
  docketClerkAddsCaseToHearing(cerebralTest, 'Test hearing note one.');
  docketClerkViewsNewTrialSession(cerebralTest, true, 'Test hearing note one.');

  loginAs(cerebralTest, 'judgeCohen@example.com');
  judgeViewsTrialSessionWorkingCopy(
    cerebralTest,
    true,
    'Test hearing note one.',
  );

  loginAs(cerebralTest, 'petitioner@example.com');
  it('create case 2', async () => {
    const caseDetail = await uploadPetition(cerebralTest);
    expect(caseDetail.docketNumber).toBeDefined();
    cerebralTest.docketNumber = caseDetail.docketNumber;
    cerebralTest.createdCases.push(cerebralTest.docketNumber);
  });

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkPrioritizesCase(cerebralTest);

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkAddsCaseToHearing(cerebralTest, 'Test hearing note two.');
  docketClerkViewsNewTrialSession(cerebralTest, true, 'Test hearing note two.');

  loginAs(cerebralTest, 'petitioner@example.com');
  it('create case 3', async () => {
    const caseDetail = await uploadPetition(cerebralTest, {
      preferredTrialCity: trialLocation1,
    });
    expect(caseDetail.docketNumber).toBeDefined();
    cerebralTest.docketNumber = caseDetail.docketNumber;
    cerebralTest.createdCases.push(cerebralTest.docketNumber);
  });

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkBlocksCase(cerebralTest, trialLocation1, {
    caseCaption: 'Mona Schultz, Petitioner',
    caseStatus: 'New',
    docketNumberSuffix: 'L',
  });

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkAddsCaseToHearing(cerebralTest, 'Test hearing note three.');
  docketClerkViewsNewTrialSession(
    cerebralTest,
    true,
    'Test hearing note three.',
  );

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkAddsCaseToHearing(cerebralTest, 'Test hearing note four.');
  docketClerkEditsHearingNote(cerebralTest, 'Updated test hearing note four.');
  docketClerkRemovesCaseFromHearing(cerebralTest);
});
