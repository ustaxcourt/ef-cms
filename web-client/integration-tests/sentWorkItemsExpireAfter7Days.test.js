import {
  CASE_STATUS_TYPES,
  ROLES,
} from '../../shared/src/business/entities/EntityConstants';
import {
  getFormattedMyOutbox,
  getFormattedSectionOutbox,
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

  loginAs(test, 'petitioner');

  it('creates the case', async () => {
    caseDetail = await uploadPetition(test);
    expect(caseDetail.docketNumber).toBeDefined();

    const applicationContext = applicationContextFactory({
      role: ROLES.petitionsClerk,
      section: 'petitions',
      userId: '3805d1ab-18d0-43ec-bafb-654e83405416',
    });

    const CREATED_8_DAYS_AGO = new Date();
    const CREATED_7_DAYS_AGO = new Date();
    const CREATED_6_DAYS_AGO = new Date();
    CREATED_8_DAYS_AGO.setDate(new Date().getDate() - 8);
    CREATED_7_DAYS_AGO.setDate(new Date().getDate() - 7);
    CREATED_6_DAYS_AGO.setDate(new Date().getDate() - 6);

    workItemId6 = applicationContext.getUniqueId();
    workItemId7 = applicationContext.getUniqueId();
    workItemId8 = applicationContext.getUniqueId();

    workItem8Days = {
      assigneeId: '3805d1ab-18d0-43ec-bafb-654e83405416',
      assigneeName: 'Test petitionsclerk1',
      caseId: 'd481929a-fb22-4800-900e-50b15ac55934',
      caseStatus: CASE_STATUS_TYPES.new,
      createdAt: CREATED_8_DAYS_AGO.toISOString(),
      docketNumber: caseDetail.docketNumber,
      docketNumberSuffix: null,
      document: {
        createdAt: '2019-06-25T15:14:11.924Z',
        documentId: '01174a9a-7ac4-43ff-a163-8ed421f9612d',
        documentType: 'Petition',
      },
      isInitializeCase: false,
      isQC: false,
      messages: [
        {
          createdAt: CREATED_8_DAYS_AGO.toISOString(),
          from: 'Test petitionsclerk1',
          fromUserId: '3805d1ab-18d0-43ec-bafb-654e83405416',
          message: 'Testing a Created Message',
          messageId: 'c31368e6-8e75-4400-ad1d-a0b2bf0a4083',
          to: 'Test petitionsclerk1',
          toUserId: '3805d1ab-18d0-43ec-bafb-654e83405416',
        },
      ],
      section: 'petitions',
      sentBy: 'Test petitionsclerk1',
      sentBySection: 'petitions',
      sentByUserId: '3805d1ab-18d0-43ec-bafb-654e83405416',
      updatedAt: '2019-06-26T16:31:17.643Z',
      workItemId: `${workItemId8}`,
    };

    workItem7Days = {
      ...workItem8Days,
      createdAt: CREATED_7_DAYS_AGO.toISOString(),
      workItemId: `${workItemId7}`,
    };
    workItem7Days.messages[0].createdAt = CREATED_7_DAYS_AGO.toISOString();

    workItem6Days = {
      ...workItem8Days,
      createdAt: CREATED_6_DAYS_AGO.toISOString(),
      workItemId: `${workItemId6}`,
    };
    workItem7Days.messages[0].createdAt = CREATED_6_DAYS_AGO.toISOString();

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

  loginAs(test, 'petitionsclerk');

  it('the petitionsclerk user should have the expected work items equal to or new than 7 days', async () => {
    const myOutbox = (await getFormattedMyOutbox(test)).filter(
      item => item.docketNumber === caseDetail.docketNumber,
    );
    expect(myOutbox.length).toEqual(2);
    expect(
      myOutbox.find(item => item.workItemId === workItemId6),
    ).toBeDefined();
    expect(
      myOutbox.find(item => item.workItemId === workItemId7),
    ).toBeDefined();

    const sectionOutbox = (await getFormattedSectionOutbox(test)).filter(
      item => item.docketNumber === caseDetail.docketNumber,
    );
    expect(sectionOutbox.length).toEqual(2);
    expect(
      sectionOutbox.find(item => item.workItemId === workItemId6),
    ).toBeDefined();
    expect(
      sectionOutbox.find(item => item.workItemId === workItemId7),
    ).toBeDefined();
  });
});
