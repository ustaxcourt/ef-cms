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

const test = setupTest();

describe('trial hearings journey', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    test.closeSocket();
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
  test.createdTrialSessions = [];
  test.createdCases = [];

  loginAs(test, 'docketclerk@example.com');
  docketClerkCreatesATrialSession(test, overrides1);
  docketClerkViewsTrialSessionList(test);
  docketClerkViewsNewTrialSession(test);
  docketClerkCreatesATrialSession(test, overrides2);
  docketClerkViewsTrialSessionList(test);
  docketClerkViewsNewTrialSession(test);

  loginAs(test, 'petitioner@example.com');
  it('create case 1', async () => {
    const caseDetail = await uploadPetition(test, overrides1);
    expect(caseDetail.docketNumber).toBeDefined();
    test.docketNumber = caseDetail.docketNumber;
    test.createdCases.push(test.docketNumber);
  });

  loginAs(test, 'docketclerk@example.com');
  docketClerkManuallyAddsCaseToTrialSessionWithNote(test);
  docketClerkAddsCaseToHearing(test, 'Test hearing note one.');
  docketClerkViewsNewTrialSession(test, true, 'Test hearing note one.');

  loginAs(test, 'judgeCohen@example.com');
  judgeViewsTrialSessionWorkingCopy(test, true, 'Test hearing note one.');

  loginAs(test, 'petitioner@example.com');
  it('create case 2', async () => {
    const caseDetail = await uploadPetition(test);
    expect(caseDetail.docketNumber).toBeDefined();
    test.docketNumber = caseDetail.docketNumber;
    test.createdCases.push(test.docketNumber);
  });

  loginAs(test, 'petitionsclerk@example.com');
  petitionsClerkPrioritizesCase(test);

  loginAs(test, 'docketclerk@example.com');
  docketClerkAddsCaseToHearing(test, 'Test hearing note two.');
  docketClerkViewsNewTrialSession(test, true, 'Test hearing note two.');

  loginAs(test, 'petitioner@example.com');
  it('create case 3', async () => {
    const caseDetail = await uploadPetition(test, {
      preferredTrialCity: trialLocation1,
    });
    expect(caseDetail.docketNumber).toBeDefined();
    test.docketNumber = caseDetail.docketNumber;
    test.createdCases.push(test.docketNumber);
  });

  loginAs(test, 'petitionsclerk@example.com');
  petitionsClerkBlocksCase(test, trialLocation1, {
    caseCaption: 'Mona Schultz, Petitioner',
    caseStatus: 'New',
    docketNumberSuffix: 'L',
  });

  loginAs(test, 'docketclerk@example.com');
  docketClerkAddsCaseToHearing(test, 'Test hearing note three.');
  docketClerkViewsNewTrialSession(test, true, 'Test hearing note three.');

  loginAs(test, 'docketclerk@example.com');
  docketClerkAddsCaseToHearing(test, 'Test hearing note four.');
  docketClerkEditsHearingNote(test, 'Updated test hearing note four.');
  docketClerkRemovesCaseFromHearing(test);
});
