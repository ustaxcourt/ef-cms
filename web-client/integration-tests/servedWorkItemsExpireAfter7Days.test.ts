import { CHIEF_JUDGE } from '@shared/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { createApplicationContext as applicationContextFactory } from '../../web-api/src/applicationContext';
import {
  getFormattedDocumentQCMyOutbox,
  getFormattedDocumentQCSectionOutbox,
  loginAs,
  setupTest,
  uploadPetition,
} from './helpers';
import { mockPetitionsClerkUser } from '@shared/test/mockAuthUsers';
import { saveWorkItem } from '@web-api/persistence/postgres/workitems/saveWorkItem';

const {
  IRS_SYSTEM_SECTION,
  PETITIONS_SECTION,
  STATUS_TYPES: CASE_STATUS_TYPES,
} = applicationContext.getConstants();

const cerebralTest = setupTest();

describe('verify old served work items do not show up in the outbox', () => {
  let workItem8Days;
  let workItem7Days;
  let workItem6Days;
  let caseDetail;

  let workItemId6;
  let workItemId7;
  let workItemId8;

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  loginAs(cerebralTest, 'petitioner@example.com');

  it('creates a case', async () => {
    caseDetail = await uploadPetition(cerebralTest);
    expect(caseDetail.docketNumber).toBeDefined();

    const mockUser = {
      ...mockPetitionsClerkUser,
      userId: '3805d1ab-18d0-43ec-bafb-654e83405416',
    };

    const appContext = applicationContextFactory(mockUser);
    appContext.environment.dynamoDbTableName = 'efcms-local';

    const CREATED_8_DAYS_AGO = applicationContext
      .getUtilities()
      .calculateISODate({ howMuch: -8, units: 'days' });
    const CREATED_7_DAYS_AGO = applicationContext
      .getUtilities()
      .calculateISODate({ howMuch: -7, units: 'days' });
    const CREATED_6_DAYS_AGO = applicationContext
      .getUtilities()
      .calculateISODate({ howMuch: -6, units: 'days' });

    workItemId6 = appContext.getUniqueId();
    workItemId7 = appContext.getUniqueId();
    workItemId8 = appContext.getUniqueId();

    workItem8Days = {
      assigneeId: mockUser.userId,
      assigneeName: 'Test petitionsclerk1',
      associatedJudge: CHIEF_JUDGE,
      caseStatus: CASE_STATUS_TYPES.new,
      completedAt: '2019-06-26T16:31:17.643Z',
      completedByUserId: mockUser.userId,
      createdAt: CREATED_8_DAYS_AGO,
      docketEntry: {
        createdAt: '2019-06-25T15:14:11.924Z',
        docketEntryId: '01174a9a-7ac4-43ff-a163-8ed421f9612d',
        documentType: 'Petition',
      },
      docketNumber: caseDetail.docketNumber,
      docketNumberSuffix: null,
      isInitializeCase: false,
      section: IRS_SYSTEM_SECTION,
      sentBy: 'Test petitionsclerk1',
      sentBySection: PETITIONS_SECTION,
      sentByUserId: mockUser.userId,
      updatedAt: '2019-06-26T16:31:17.643Z',
      workItemId: `${workItemId8}`,
    };

    workItem7Days = {
      ...workItem8Days,
      completedAt: CREATED_7_DAYS_AGO,
      createdAt: CREATED_7_DAYS_AGO,
      workItemId: `${workItemId7}`,
    };

    workItem6Days = {
      ...workItem8Days,
      completedAt: CREATED_6_DAYS_AGO,
      createdAt: CREATED_6_DAYS_AGO,
      workItemId: `${workItemId6}`,
    };

    await saveWorkItem({
      workItem: workItem8Days,
    });

    await saveWorkItem({
      workItem: workItem7Days,
    });

    await saveWorkItem({
      workItem: workItem6Days,
    });
  });

  loginAs(cerebralTest, 'petitionsclerk@example.com');

  it('the petitionsclerk user should have the expected work items equal to or new than 7 days', async () => {
    const myOutbox = (
      await getFormattedDocumentQCMyOutbox(cerebralTest)
    ).filter(item => item.docketNumber === caseDetail.docketNumber);
    expect(myOutbox.length).toEqual(2);
    expect(
      myOutbox.find(item => item.workItemId === workItemId6),
    ).toBeDefined();
    expect(
      myOutbox.find(item => item.workItemId === workItemId7),
    ).toBeDefined();

    const sectionOutbox = (
      await getFormattedDocumentQCSectionOutbox(cerebralTest)
    ).filter(item => item.docketNumber === caseDetail.docketNumber);
    expect(sectionOutbox.length).toEqual(2);
    expect(
      sectionOutbox.find(item => item.workItemId === workItemId6),
    ).toBeDefined();
    expect(
      sectionOutbox.find(item => item.workItemId === workItemId7),
    ).toBeDefined();
  });
});
