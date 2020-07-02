const {
  assignWorkItemsInteractor,
} = require('../useCases/workitems/assignWorkItemsInteractor');
const {
  getDocumentQCInboxForUserInteractor,
} = require('../useCases/workitems/getDocumentQCInboxForUserInteractor');
const {
  setWorkItemAsReadInteractor,
} = require('../useCases/workitems/setWorkItemAsReadInteractor');
const { applicationContext } = require('../test/createTestApplicationContext');
const { createCaseInteractor } = require('../useCases/createCaseInteractor');
const { getCaseInteractor } = require('../useCases/getCaseInteractor');
const { PARTY_TYPES, ROLES } = require('../entities/EntityConstants');
const { User } = require('../entities/User');
const { WorkItem } = require('../entities/WorkItem');

describe('setWorkItemAsReadInteractor integration test', () => {
  const DATETIME = '2019-03-01T22:54:06.000Z';

  beforeAll(() => {
    window.Date.prototype.toISOString = jest.fn().mockReturnValue(DATETIME);
  });

  it('should create the expected case into the database', async () => {
    const { docketNumber } = await createCaseInteractor({
      applicationContext,
      petitionFileId: '92eac064-9ca5-4c56-80a0-c5852c752277',
      petitionMetadata: {
        caseType: 'Innocent Spouse',
        contactPrimary: {
          address1: '19 First Freeway',
          address2: 'Ad cumque quidem lau',
          address3: 'Anim est dolor animi',
          city: 'Rerum eaque cupidata',
          countryType: 'domestic',
          email: 'petitioner@example.com',
          name: 'Rick Petitioner',
          phone: '+1 (599) 681-5435',
          postalCode: '89614',
          state: 'AL',
        },
        contactSecondary: {},
        filingType: 'Myself',
        hasIrsNotice: false,
        partyType: PARTY_TYPES.petitioner,
        preferredTrialCity: 'Aberdeen, South Dakota',
        procedureType: 'Small',
      },
      stinFileId: '72de0fac-f63c-464f-ac71-0f54fd248484',
    });

    applicationContext.getCurrentUser.mockReturnValue(
      new User({
        name: 'richard',
        role: ROLES.petitionsClerk,
        userId: '3805d1ab-18d0-43ec-bafb-654e83405416',
      }),
    );

    const createdCase = await getCaseInteractor({
      applicationContext,
      docketNumber,
    });

    const workItem = createdCase.documents.find(
      d => d.documentType === 'Petition',
    ).workItems[0];

    const workItemEntity = new WorkItem(workItem, { applicationContext });

    let inbox = await getDocumentQCInboxForUserInteractor({
      applicationContext,
      userId: applicationContext.getCurrentUser().userId,
    });
    expect(inbox).toEqual([]);

    await assignWorkItemsInteractor({
      applicationContext,
      assigneeId: '3805d1ab-18d0-43ec-bafb-654e83405416',
      assigneeName: 'richard',
      workItemId: workItem.workItemId,
    });
    inbox = await getDocumentQCInboxForUserInteractor({
      applicationContext,
      userId: applicationContext.getCurrentUser().userId,
    });
    expect(inbox.isRead).toBeFalsy();

    await setWorkItemAsReadInteractor({
      applicationContext,
      workItemId: workItemEntity.workItemId,
    });

    inbox = await getDocumentQCInboxForUserInteractor({
      applicationContext,
      userId: applicationContext.getCurrentUser().userId,
    });
    expect(inbox).toMatchObject([
      {
        isRead: true,
      },
    ]);
  });
});
