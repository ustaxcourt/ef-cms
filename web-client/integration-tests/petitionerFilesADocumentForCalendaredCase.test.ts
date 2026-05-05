import { docketClerkCreatesATrialSession } from './journey/docketClerkCreatesATrialSession';
import { docketClerkRemovesCaseFromTrial } from './journey/docketClerkRemovesCaseFromTrial';
import { docketClerkViewsSectionInboxHighPriority } from './journey/docketClerkViewsSectionInboxHighPriority';
import { docketClerkViewsSectionInboxNotHighPriority } from './journey/docketClerkViewsSectionInboxNotHighPriority';
import { docketClerkViewsTrialSessionList } from './journey/docketClerkViewsTrialSessionList';
import {
  fakeFile,
  loginAs,
  refreshElasticsearchIndex,
  setupTest,
  uploadPetition,
  waitForExpectedItem,
  waitForExpectedItemToExist,
  waitForLoadingComponentToHide,
  waitForModalsToHide,
} from './helpers';
import { getCurrentDateTimeInMillis } from '@shared/business/utilities/DateHandler';
import { petitionerFilesDocumentForCase } from './journey/petitionerFilesDocumentForCase';
import { petitionsClerkSetsATrialSessionsSchedule } from './journey/petitionsClerkSetsATrialSessionsSchedule';

describe('petitioner files document', () => {
  const cerebralTest = setupTest();

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  loginAs(cerebralTest, 'petitioner@example.com');
  it('Create case', async () => {
    const caseDetail = await uploadPetition(cerebralTest);
    expect(caseDetail.docketNumber).toBeDefined();
    cerebralTest.docketNumber = caseDetail.docketNumber;
  });

  const trialLocation = `Jacksonville, Florida, ${getCurrentDateTimeInMillis()}`;

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkCreatesATrialSession(cerebralTest, { trialLocation });
  docketClerkViewsTrialSessionList(cerebralTest);

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkSetsATrialSessionsSchedule(cerebralTest);
  it('manually add the case to the session', async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });
    await cerebralTest.runSequence('openAddToTrialModalSequence');
    await cerebralTest.runSequence('updateModalValueSequence', {
      key: 'trialSessionId',
      value: cerebralTest.trialSessionId,
    });

    await cerebralTest.runSequence('addCaseToTrialSessionSequence');

    await waitForLoadingComponentToHide({ cerebralTest });
    await waitForModalsToHide({ cerebralTest });
    await waitForExpectedItem({
      cerebralTest,
      currentItem: 'alertSuccess.message',
      expectedItem: 'Case set for trial.',
    });
    await waitForExpectedItemToExist({
      cerebralTest,
      currentItem: 'caseDetail.trialDate',
    });

    expect(cerebralTest.getState('alertSuccess.message')).toEqual(
      'Case set for trial.',
    );
    expect(cerebralTest.getState('caseDetail.trialDate')).toBeDefined();
  });

  loginAs(cerebralTest, 'petitioner@example.com');
  petitionerFilesDocumentForCase(cerebralTest, fakeFile);

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkViewsSectionInboxHighPriority(cerebralTest);
  docketClerkRemovesCaseFromTrial(cerebralTest);

  it('refresh elasticsearch index', async () => {
    await refreshElasticsearchIndex();

    expect(cerebralTest.getState('currentPage')).toEqual('CaseDetailInternal');
  });

  docketClerkViewsSectionInboxNotHighPriority(cerebralTest);
});
