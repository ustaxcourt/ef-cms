const sinon = require('sinon');
const uuid = require('uuid');
const {
  PetitionFromPaperWithoutFiles,
} = require('../entities/PetitionFromPaperWithoutFiles');
const { createCaseFromPaper } = require('./createCaseFromPaperInteractor');
const { User } = require('../entities/User');

describe('createCaseFromPaper', () => {
  let applicationContext;
  const MOCK_CASE_ID = '413f62ce-d7c8-446e-aeda-14a2a625a626';
  const MOCK_DOCKET_NUMBER = '101-18';
  const DATE = '2018-11-21T20:49:28.192Z';

  beforeEach(() => {
    sinon.stub(uuid, 'v4').returns(MOCK_CASE_ID);
    sinon.stub(window.Date.prototype, 'toISOString').returns(DATE);
  });

  afterEach(() => {
    window.Date.prototype.toISOString.restore();
    uuid.v4.restore();
  });

  it('throws an error if the user is not valid or authorized', async () => {
    applicationContext = {
      getCurrentUser: () => {
        return {};
      },
    };
    let error;
    try {
      await createCaseFromPaper({ applicationContext });
    } catch (err) {
      error = err;
    }
    expect(error.message).toContain('Unauthorized');
  });

  it('should create a case entity (with a generated caseId) and return it', async () => {
    const saveCaseStub = sinon.stub().callsFake(({ caseToSave }) => caseToSave);
    applicationContext = {
      docketNumberGenerator: {
        createDocketNumber: () => Promise.resolve(MOCK_DOCKET_NUMBER),
      },
      environment: { stage: 'local' },
      getCurrentUser: () => {
        return new User({
          name: 'Patty Clark',
          role: 'petitionsclerk',
          userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
        });
      },
      getEntityConstructors: () => ({
        PetitionFromPaper: PetitionFromPaperWithoutFiles,
      }),
      getPersistenceGateway: () => {
        return {
          saveCase: saveCaseStub,
        };
      },
      getUseCases: () => ({
        getUser: () => ({
          address: '123',
          email: 'test@example.com',
          name: 'Patrick Petitioner',
          phone: '(123) 456-7890',
          role: 'petitioner',
        }),
      }),
    };

    const createdCase = await createCaseFromPaper({
      applicationContext,
      ownershipDisclosureFileId: '413f62ce-7c8d-446e-aeda-14a2a625a626',
      petitionFileId: '413f62ce-d7c8-446e-aeda-14a2a625a626',
      petitionMetadata: {
        caseCaption: 'Diana Prince, Petitioner',
        caseType: 'other',
        contactPrimary: {
          address1: '99 South Oak Lane',
          address2: 'Culpa numquam saepe ',
          address3: 'Eaque voluptates com',
          city: 'Dignissimos voluptat',
          countryType: 'domestic',
          email: 'petitioner1@example.com',
          name: 'Diana Prince',
          phone: '+1 (215) 128-6587',
          postalCode: '69580',
          state: 'AR',
        },
        contactSecondary: {},
        filingType: 'Myself',
        hasIrsNotice: true,
        irsNoticeDate: DATE,
        partyType: 'Petitioner',
        preferredTrialCity: 'Chattanooga, TN',
        procedureType: 'Small',
        receivedAt: '2018-11-21T20:49:28.192Z',
      },
      stinFileId: '413f62ce-7c8d-446e-aeda-14a2a625a611',
    });

    const expectedCaseRecordToPersist = {
      caseCaption: 'Diana Prince, Petitioner',
      caseId: '413f62ce-d7c8-446e-aeda-14a2a625a626',
      caseType: 'other',
      contactPrimary: {
        name: 'Diana Prince',
      },
      createdAt: '2018-11-21T20:49:28.192Z',
      docketNumber: '101-18',
      docketNumberSuffix: 'S',
      docketRecord: [
        {
          description: 'Request for Place of Trial at Chattanooga, TN',
          filingDate: '2018-11-21T20:49:28.192Z',
        },
        {
          description: 'Petition',
          filedBy: 'Diana Prince',
          filingDate: '2018-11-21T20:49:28.192Z',
          status: undefined,
        },
        {
          description: 'Ownership Disclosure Statement',
          filedBy: 'Diana Prince',
          filingDate: '2018-11-21T20:49:28.192Z',
          status: undefined,
        },
      ],
      documents: [
        {
          caseId: '413f62ce-d7c8-446e-aeda-14a2a625a626',
          createdAt: '2018-11-21T20:49:28.192Z',
          documentId: '413f62ce-d7c8-446e-aeda-14a2a625a626',
          documentType: 'Petition',
          filedBy: 'Diana Prince',
          userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
          workItems: [
            {
              assigneeId: '6805d1ab-18d0-43ec-bafb-654e83405416',
              assigneeName: 'Patty Clark',
              caseId: '413f62ce-d7c8-446e-aeda-14a2a625a626',
              caseStatus: 'New',
              createdAt: '2018-11-21T20:49:28.192Z',
              docketNumber: '101-18',
              docketNumberSuffix: 'S',
              document: {
                createdAt: '2018-11-21T20:49:28.192Z',
                documentId: '413f62ce-d7c8-446e-aeda-14a2a625a626',
                documentType: 'Petition',
                filedBy: 'Diana Prince',
                userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
                workItems: [],
              },
              messages: [
                {
                  createdAt: '2018-11-21T20:49:28.192Z',
                  from: 'Patty Clark',
                  fromUserId: '6805d1ab-18d0-43ec-bafb-654e83405416',
                  message:
                    'Petition filed by Diana Prince is ready for review.',
                  messageId: '413f62ce-d7c8-446e-aeda-14a2a625a626',
                },
              ],
              section: 'petitions',
              sentBy: '6805d1ab-18d0-43ec-bafb-654e83405416',
              updatedAt: '2018-11-21T20:49:28.192Z',
              workItemId: '413f62ce-d7c8-446e-aeda-14a2a625a626',
            },
          ],
        },
        {
          caseId: '413f62ce-d7c8-446e-aeda-14a2a625a626',
          createdAt: '2018-11-21T20:49:28.192Z',
          documentId: '413f62ce-7c8d-446e-aeda-14a2a625a611',
          documentType: 'Statement of Taxpayer Identification',
          filedBy: 'Diana Prince',
          userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
          workItems: [],
        },
        {
          caseId: '413f62ce-d7c8-446e-aeda-14a2a625a626',
          createdAt: '2018-11-21T20:49:28.192Z',
          documentId: '413f62ce-7c8d-446e-aeda-14a2a625a626',
          documentType: 'Ownership Disclosure Statement',
          filedBy: 'Diana Prince',
          userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
          workItems: [],
        },
      ],
      filingType: 'Myself',
      hasIrsNotice: true,
      irsNoticeDate: '2018-11-21T20:49:28.192Z',
      partyType: 'Petitioner',
      preferredTrialCity: 'Chattanooga, TN',
      procedureType: 'Small',
      status: 'New',
      userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    };
    const caseRecordSentToPersistence = saveCaseStub.getCall(0).args[0]
      .caseToSave;
    expect(createdCase).toMatchObject(expectedCaseRecordToPersist);
    expect(createdCase).toMatchObject(caseRecordSentToPersistence);
  });
});
