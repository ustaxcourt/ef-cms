import {
  CASE_STATUS_TYPES,
  ROLES,
} from '../../shared/src/business/entities/EntityConstants';
import {
  getFormattedDocumentQCMyOutbox,
  getFormattedDocumentQCSectionOutbox,
  loginAs,
  setupTest,
  uploadPetition,
} from './helpers';
import applicationContextFactory from '../../web-api/src/applicationContext';

const test = setupTest();

describe('verify old sent work items do not show up in the outbox', () => {
  let workItem6Days;
  let workItem7Days;
  let workItem8Days;
  let workItemId6;
  let workItemId7;
  let workItemId8;
  let caseDetail;

  beforeEach(async () => {
    jest.setTimeout(30000);
  });

  loginAs(test, 'petitioner@example.com');

  it('creates the case', async () => {
    caseDetail = await uploadPetition(test);
    expect(caseDetail.docketNumber).toBeDefined();

    const applicationContext = applicationContextFactory({
      role: ROLES.petitionsClerk,
      section: 'petitions',
      userId: '3805d1ab-18d0-43ec-bafb-654e83405416',
    });
    applicationContext.environment.dynamoDbTableName = 'efcms-local';

    const currentTime = applicationContext.getUtilities().createISODateString();
    const CREATED_8_DAYS_AGO = applicationContext
      .getUtilities()
      .calculateISODate(currentTime, -8, 'days');
    const CREATED_7_DAYS_AGO = applicationContext
      .getUtilities()
      .calculateISODate(currentTime, -7, 'days');
    const CREATED_6_DAYS_AGO = applicationContext
      .getUtilities()
      .calculateISODate(currentTime, -6, 'days');

    workItemId6 = applicationContext.getUniqueId();
    workItemId7 = applicationContext.getUniqueId();
    workItemId8 = applicationContext.getUniqueId();

    workItem8Days = {
      assigneeId: '3805d1ab-18d0-43ec-bafb-654e83405416',
      assigneeName: 'Test petitionsclerk1',
      caseStatus: CASE_STATUS_TYPES.new,
      completedBy: 'Test Petitionsclerk',
      completedByUserId: '3805d1ab-18d0-43ec-bafb-654e83405416',
      createdAt: CREATED_8_DAYS_AGO.toISOString(),
      docketEntry: {
        createdAt: '2019-06-25T15:14:11.924Z',
        docketEntryId: '01174a9a-7ac4-43ff-a163-8ed421f9612d',
        documentType: 'Petition',
      },
      docketNumber: caseDetail.docketNumber,
      docketNumberSuffix: null,
      isInitializeCase: false,
      section: 'petitions',
      sentBy: 'Test petitionsclerk1',
      sentBySection: 'petitions',
      sentByUserId: '3805d1ab-18d0-43ec-bafb-654e83405416',
      updatedAt: '2019-06-26T16:31:17.643Z',
      workItemId: `${workItemId8}`,
    };

    workItem7Days = {
      ...workItem8Days,
      completedAt: CREATED_7_DAYS_AGO.toISOString(),
      createdAt: CREATED_7_DAYS_AGO.toISOString(),
      workItemId: `${workItemId7}`,
    };

    workItem6Days = {
      ...workItem8Days,
      completedAt: CREATED_6_DAYS_AGO.toISOString(),
      createdAt: CREATED_6_DAYS_AGO.toISOString(),
      workItemId: `${workItemId6}`,
    };

    await applicationContext.getPersistenceGateway().putWorkItemInOutbox({
      applicationContext,
      workItem: workItem8Days,
    });

    await applicationContext.getPersistenceGateway().putWorkItemInOutbox({
      applicationContext,
      workItem: workItem7Days,
    });

    await applicationContext.getPersistenceGateway().putWorkItemInOutbox({
      applicationContext,
      workItem: workItem6Days,
    });
  });

  loginAs(test, 'petitionsclerk@example.com');

  it('the petitionsclerk user should have the expected work items equal to or new than 7 days', async () => {
    const myOutbox = (await getFormattedDocumentQCMyOutbox(test)).filter(
      item => item.docketNumber === caseDetail.docketNumber,
    );
    expect(myOutbox.length).toEqual(2);
    expect(
      myOutbox.find(item => item.workItemId === workItemId6),
    ).toBeDefined();
    expect(
      myOutbox.find(item => item.workItemId === workItemId7),
    ).toBeDefined();

    const sectionOutbox = (
      await getFormattedDocumentQCSectionOutbox(test)
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
