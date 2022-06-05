import {
  CASE_STATUS_TYPES,
  SYSTEM_GENERATED_DOCUMENT_TYPES,
} from '../../shared/src/business/entities/EntityConstants';
import { docketClerkCreatesATrialSession } from './journey/docketClerkCreatesATrialSession';
import { docketClerkEditsTrialSession } from './journey/docketClerkEditsTrialSession';
import { docketClerkUpdatesCaseStatusToClosed } from './journey/docketClerkUpdatesCaseStatusToClosed';
import { docketClerkVerifiesCaseStatusIsUnchanged } from './journey/docketClerkVerifiesCaseStatusIsUnchanged';
import { docketClerkViewsTrialSessionList } from './journey/docketClerkViewsTrialSessionList';
import { loginAs, setupTest, uploadPetition } from './helpers';
import { markAllCasesAsQCed } from './journey/markAllCasesAsQCed';
import { petitionsClerkManuallyAddsCaseToTrial } from './journey/petitionsClerkManuallyAddsCaseToTrial';
import { petitionsClerkSetsATrialSessionsSchedule } from './journey/petitionsClerkSetsATrialSessionsSchedule';

describe('Docket Clerk edits a calendared trial session', () => {
  const cerebralTest = setupTest();

  beforeEach(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  const trialLocation = `Helena, Montana, ${Date.now()}`;

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkCreatesATrialSession(cerebralTest, {
    trialLocation,
  });
  docketClerkViewsTrialSessionList(cerebralTest);

  let caseDetail;
  cerebralTest.casesReadyForTrial = [];

  for (let i = 0; i < 3; i++) {
    loginAs(cerebralTest, 'petitioner@example.com');
    it('login as a petitioner and create 3 cases', async () => {
      caseDetail = await uploadPetition(cerebralTest);
      expect(caseDetail.docketNumber).toBeDefined();
      cerebralTest.casesReadyForTrial.push({
        docketNumber: caseDetail.docketNumber,
      });
      cerebralTest.docketNumber = caseDetail.docketNumber;
    });

    loginAs(cerebralTest, 'petitionsclerk@example.com');
    petitionsClerkManuallyAddsCaseToTrial(cerebralTest);
  }

  it('verify that there are 3 cases on the trial session', async () => {
    await cerebralTest.runSequence('gotoTrialSessionDetailSequence', {
      trialSessionId: cerebralTest.trialSessionId,
    });

    expect(cerebralTest.getState('trialSession.caseOrder').length).toBe(3);
  });

  markAllCasesAsQCed(cerebralTest, () =>
    cerebralTest.casesReadyForTrial.map(d => d.docketNumber),
  );
  petitionsClerkSetsATrialSessionsSchedule(cerebralTest);

  it('verify that there are 3 cases on the trial session', async () => {
    await cerebralTest.runSequence('gotoTrialSessionDetailSequence', {
      trialSessionId: cerebralTest.trialSessionId,
    });

    expect(cerebralTest.getState('trialSession.caseOrder').length).toBe(3);
  });

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkUpdatesCaseStatusToClosed(cerebralTest);

  const overrides = {
    fieldToUpdate: 'judge',
    valueToUpdate: {
      name: 'Gustafson',
      userId: 'dabbad05-18d0-43ec-bafb-654e83405416',
    },
  };
  docketClerkEditsTrialSession(cerebralTest, overrides);

  it('verify that there are 3 cases on the trial session', async () => {
    await cerebralTest.runSequence('gotoTrialSessionDetailSequence', {
      trialSessionId: cerebralTest.trialSessionId,
    });

    expect(cerebralTest.getState('trialSession.caseOrder').length).toBe(3);
  });

  it('verify that a Notice of Change of Trial Judge was generated for each open case', async () => {
    for (const calendaredCase of cerebralTest.casesReadyForTrial) {
      await cerebralTest.runSequence('gotoCaseDetailSequence', {
        docketNumber: calendaredCase.docketNumber,
      });

      const { docketEntries, status } = cerebralTest.getState('caseDetail');

      const expectedGeneratedNotice = docketEntries.find(
        entry =>
          entry.documentType ===
          SYSTEM_GENERATED_DOCUMENT_TYPES.noticeOfChangeOfTrialJudge
            .documentType,
      );

      if (status === CASE_STATUS_TYPES.closed) {
        expect(expectedGeneratedNotice).toBeUndefined();
      } else {
        expect(expectedGeneratedNotice).toBeDefined();
      }
    }
  });

  docketClerkVerifiesCaseStatusIsUnchanged(cerebralTest);
});
