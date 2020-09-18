const {
  assignWorkItemsInteractor,
} = require('../useCases/workitems/assignWorkItemsInteractor');
const {
  CASE_TYPES_MAP,
  COUNTRY_TYPES,
  PARTY_TYPES,
  PETITIONS_SECTION,
  ROLES,
} = require('../entities/EntityConstants');
const {
  getDocumentQCInboxForUserInteractor,
} = require('../useCases/workitems/getDocumentQCInboxForUserInteractor');
const { applicationContext } = require('../test/createTestApplicationContext');
const { createCaseInteractor } = require('../useCases/createCaseInteractor');
const { getCaseInteractor } = require('../useCases/getCaseInteractor');
const { User } = require('../entities/User');

describe('assignWorkItemsInteractor integration test', () => {
  const CREATED_DATE = '2019-03-01T22:54:06.000Z';

  beforeAll(() => {
    window.Date.prototype.toISOString = jest.fn().mockReturnValue(CREATED_DATE);
  });

  it('should create the expected case into the database', async () => {
    const { docketNumber } = await createCaseInteractor({
      applicationContext,
      caseCaption: 'Caption',
      petitionFileId: '92eac064-9ca5-4c56-80a0-c5852c752277',
      petitionMetadata: {
        caseType: CASE_TYPES_MAP.innocentSpouse,
        contactPrimary: {
          address1: '19 First Freeway',
          address2: 'Ad cumque quidem lau',
          address3: 'Anim est dolor animi',
          city: 'Rerum eaque cupidata',
          countryType: COUNTRY_TYPES.DOMESTIC,
          email: 'petitioner@example.com',
          name: 'Rick Petitioner',
          phone: '+1 (599) 681-5435',
          postalCode: '89614',
          state: 'AK',
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
        name: 'Test Petitionsclerk',
        role: ROLES.petitionsClerk,
        userId: '3805d1ab-18d0-43ec-bafb-654e83405416',
      }),
    );

    const createdCase = await getCaseInteractor({
      applicationContext,
      docketNumber,
    });

    const { workItem } = createdCase.docketEntries.find(
      d => d.documentType === 'Petition',
    );

    let inbox = await getDocumentQCInboxForUserInteractor({
      applicationContext,
      userId: applicationContext.getCurrentUser().userId,
    });
    expect(inbox).toEqual([]);

    await assignWorkItemsInteractor({
      applicationContext,
      assigneeId: '3805d1ab-18d0-43ec-bafb-654e83405416',
      assigneeName: 'Test Petitionsclerk',
      workItemId: workItem.workItemId,
    });
    inbox = await getDocumentQCInboxForUserInteractor({
      applicationContext,
      userId: applicationContext.getCurrentUser().userId,
    });

    expect(inbox).toMatchObject([
      {
        assigneeId: '3805d1ab-18d0-43ec-bafb-654e83405416',
        assigneeName: 'Test Petitionsclerk',
        docketEntry: {
          documentType: 'Petition',
          filedBy: 'Petr. Rick Petitioner',
          userId: 'a805d1ab-18d0-43ec-bafb-654e83405416',
        },
        docketNumber: '101-19',
        docketNumberWithSuffix: '101-19S',
        isInitializeCase: true,
        section: PETITIONS_SECTION,
        sentBy: 'Test Petitionsclerk',
        sentBySection: PETITIONS_SECTION,
        sentByUserId: '3805d1ab-18d0-43ec-bafb-654e83405416',
      },
    ]);

    const caseAfterAssign = await getCaseInteractor({
      applicationContext,
      docketNumber,
    });

    expect(
      caseAfterAssign.docketEntries.find(d => d.documentType === 'Petition'),
    ).toMatchObject({
      documentType: 'Petition',
      workItem: {
        assigneeId: '3805d1ab-18d0-43ec-bafb-654e83405416',
        assigneeName: 'Test Petitionsclerk',
        docketEntry: {
          documentType: 'Petition',
          filedBy: 'Petr. Rick Petitioner',
        },
      },
    });
  });
});
