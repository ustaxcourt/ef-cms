import { docketClerkCreatesAnIncompleteTrialSessionBeforeCalendaring } from './journey/docketClerkCreatesAnIncompleteTrialSessionBeforeCalendaring';
import { docketClerkSetsCaseReadyForTrial } from './journey/docketClerkSetsCaseReadyForTrial';
import { docketClerkViewsTrialSessionList } from './journey/docketClerkViewsTrialSessionList';
import { loginAs, setupTest, uploadPetition } from './helpers';
import { markAllCasesAsQCed } from './journey/markAllCasesAsQCed';
import { petitionsClerkCompletesAndSetsTrialSession } from './journey/petitionsClerkCompletesAndSetsTrialSession';
import { petitionsClerkSubmitsCaseToIrs } from './journey/petitionsClerkSubmitsCaseToIrs';
import { petitionsClerkViewsDocketRecordAfterSettingTrial } from './journey/petitionsClerkViewsDocketRecordAfterSettingTrial';

describe('Generate Notices of Trial Session with Electronically Service', () => {
  const cerebralTest = setupTest();

  cerebralTest.casesReadyForTrial = [];

  const caseCount = 2;
  const trialLocation = `Albuquerque, New Mexico, ${Date.now()}`;
  const overrides = {
    preferredTrialCity: trialLocation,
    procedureType: 'Regular', // should generate a Standing Pretrial Order
    trialLocation,
  };
  const createdDocketNumbers: string[] = [];

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  const makeCaseReadyForTrial = (testSession, id, caseOverrides) => {
    loginAs(testSession, 'petitioner@example.com');
    it(`Create case ${id}`, async () => {
      const caseDetail = await uploadPetition(testSession, caseOverrides);
      expect(caseDetail.docketNumber).toBeDefined();
      createdDocketNumbers.push(caseDetail.docketNumber);
      testSession.docketNumber = caseDetail.docketNumber;
    });

    loginAs(testSession, 'petitionsclerk@example.com');
    petitionsClerkSubmitsCaseToIrs(testSession);

    loginAs(testSession, 'docketclerk@example.com');
    docketClerkSetsCaseReadyForTrial(testSession);
  };

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkCreatesAnIncompleteTrialSessionBeforeCalendaring(
    cerebralTest,
    overrides,
  );
  docketClerkViewsTrialSessionList(cerebralTest);

  for (let i = 0; i < caseCount; i++) {
    const id = i + 1;
    makeCaseReadyForTrial(cerebralTest, id, overrides);
  }

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  markAllCasesAsQCed(cerebralTest, () => {
    return [createdDocketNumbers[0], createdDocketNumbers[1]];
  });
  petitionsClerkCompletesAndSetsTrialSession(cerebralTest);
  petitionsClerkViewsDocketRecordAfterSettingTrial(cerebralTest, {
    documentTitle: 'Standing Pretrial Order', // this is the default, but setting so it's more explicit
  });
});
