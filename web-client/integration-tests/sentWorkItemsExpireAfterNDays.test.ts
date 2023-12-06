import {
  CASE_STATUS_TYPES,
  ROLES,
} from '../../shared/src/business/entities/EntityConstants';
import { createApplicationContext as applicationContextFactory } from '../../web-api/src/applicationContext';
import {
  getFormattedDocumentQCMyOutbox,
  getFormattedDocumentQCSectionOutbox,
  loginAs,
  setupTest,
  uploadPetition,
} from './helpers';

describe('verify old sent work items do not show up in the outbox', () => {
  const cerebralTest = setupTest();

  let workItemNMinus1Days;
  let workItemNDays;
  let workItemNPlus1Days;
  let workItemIdNMinus1;
  let workItemIdN;
  let workItemIdNPlus1;
  let caseDetail;

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  loginAs(cerebralTest, 'petitioner@example.com');
  it('creates the case', async () => {
    caseDetail = await uploadPetition(cerebralTest);
    expect(caseDetail.docketNumber).toBeDefined();

    const applicationContext = applicationContextFactory({
      role: ROLES.petitionsClerk,
      section: 'petitions',
      userId: '3805d1ab-18d0-43ec-bafb-654e83405416',
    });
    applicationContext.environment.dynamoDbTableName = 'efcms-local';
    const daysToRetrieveKey =
      applicationContext.getConstants().CONFIGURATION_ITEM_KEYS
        .SECTION_OUTBOX_NUMBER_OF_DAYS.key;
    let daysToRetrieve = await applicationContext
      .getPersistenceGateway()
      .getConfigurationItemValue({
        applicationContext,
        configurationItemKey: daysToRetrieveKey,
      });

    const CREATED_N_PLUS_1_DAYS_AGO = applicationContext
      .getUtilities()
      .calculateISODate({ howMuch: (daysToRetrieve + 1) * -1, units: 'days' });
    const CREATED_N_DAYS_AGO = applicationContext
      .getUtilities()
      .calculateISODate({ howMuch: daysToRetrieve * -1, units: 'days' });
    const CREATED_N_MINUS_1_DAYS_AGO = applicationContext
      .getUtilities()
      .calculateISODate({ howMuch: (daysToRetrieve - 1) * -1, units: 'days' });

    workItemIdNMinus1 = applicationContext.getUniqueId();
    workItemIdN = applicationContext.getUniqueId();
    workItemIdNPlus1 = applicationContext.getUniqueId();

    workItemNPlus1Days = {
      assigneeId: '3805d1ab-18d0-43ec-bafb-654e83405416',
      assigneeName: 'Test petitionsclerk1',
      caseStatus: CASE_STATUS_TYPES.new,
      completedAt: CREATED_N_PLUS_1_DAYS_AGO,
      completedBy: 'Test Petitionsclerk',
      completedByUserId: '3805d1ab-18d0-43ec-bafb-654e83405416',
      createdAt: CREATED_N_PLUS_1_DAYS_AGO,
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
      workItemId: `${workItemIdNPlus1}`,
    };

    workItemNDays = {
      ...workItemNPlus1Days,
      completedAt: CREATED_N_DAYS_AGO,
      createdAt: CREATED_N_DAYS_AGO,
      workItemId: `${workItemIdN}`,
    };

    workItemNMinus1Days = {
      ...workItemNPlus1Days,
      completedAt: CREATED_N_MINUS_1_DAYS_AGO,
      createdAt: CREATED_N_MINUS_1_DAYS_AGO,
      workItemId: `${workItemIdNMinus1}`,
    };

    await applicationContext.getPersistenceGateway().putWorkItemInOutbox({
      applicationContext,
      workItem: workItemNPlus1Days,
    });

    await applicationContext.getPersistenceGateway().putWorkItemInOutbox({
      applicationContext,
      workItem: workItemNDays,
    });

    await applicationContext.getPersistenceGateway().putWorkItemInOutbox({
      applicationContext,
      workItem: workItemNMinus1Days,
    });
  });

  loginAs(cerebralTest, 'petitionsclerk@example.com');

  it('the petitionsclerk user should have the expected work items equal to or new than 7 days', async () => {
    const myOutbox = (
      await getFormattedDocumentQCMyOutbox(cerebralTest)
    ).filter(item => item.docketNumber === caseDetail.docketNumber);
    expect(myOutbox.length).toEqual(2);
    expect(
      myOutbox.find(item => item.workItemId === workItemIdNMinus1),
    ).toBeDefined();
    expect(
      myOutbox.find(item => item.workItemId === workItemIdN),
    ).toBeDefined();

    const sectionOutbox = (
      await getFormattedDocumentQCSectionOutbox(cerebralTest)
    ).filter(item => item.docketNumber === caseDetail.docketNumber);
    expect(sectionOutbox.length).toEqual(2);
    expect(
      sectionOutbox.find(item => item.workItemId === workItemIdNMinus1),
    ).toBeDefined();
    expect(
      sectionOutbox.find(item => item.workItemId === workItemIdN),
    ).toBeDefined();
  });
});
