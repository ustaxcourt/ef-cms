const { createCase } = require('./createCaseInteractor');
const sinon = require('sinon');
const uuid = require('uuid');
const User = require('../entities/User');
const PetitionWithoutFiles = require('../entities/PetitionWithoutFiles');

describe('createCase', () => {
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

  it('should create a case entity (with a generated caseId) and return it', async () => {
    const saveCaseStub = sinon.stub().callsFake(({ caseToSave }) => caseToSave);
    applicationContext = {
      docketNumberGenerator: {
        createDocketNumber: () => Promise.resolve(MOCK_DOCKET_NUMBER),
      },
      environment: { stage: 'local' },
      getCurrentUser: () => {
        return new User({
          name: 'Test Taxpayer',
          role: 'petitioner',
          userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
        });
      },
      getEntityConstructors: () => ({
        Petition: PetitionWithoutFiles,
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
          name: 'Test Taxpayer',
          phone: '(123) 456-7890',
          role: 'petitioner',
        }),
      }),
    };

    const createdCase = await createCase({
      applicationContext,
      ownershipDisclosureFileId: '413f62ce-7c8d-446e-aeda-14a2a625a626',
      petitionFileId: '413f62ce-d7c8-446e-aeda-14a2a625a626',
      petitionMetadata: {
        caseType: 'other',
        contactPrimary: {
          name: 'Diana Prince',
        },
        filingType: 'Myself',
        hasIrsNotice: true,
        irsNoticeDate: DATE,
        partyType: 'Petitioner',
        preferredTrialCity: 'Chattanooga, TN',
        procedureType: 'Small',
      },
      stinFileId: '413f62ce-7c8d-446e-aeda-14a2a625a611',
    });

    const expectedCaseRecordToPersist = {
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
          description: 'Petition',
          filedBy: 'Test Taxpayer',
          filingDate: '2018-11-21T20:49:28.192Z',
          status: undefined,
        },
        {
          description: 'Request for Place of Trial at Chattanooga, TN',
          filingDate: '2018-11-21T20:49:28.192Z',
        },
        {
          description: 'Ownership Disclosure Statement',
          filedBy: 'Test Taxpayer',
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
          filedBy: 'Test Taxpayer',
          userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
          workItems: [
            {
              assigneeId: null,
              assigneeName: null,
              caseId: '413f62ce-d7c8-446e-aeda-14a2a625a626',
              caseStatus: 'New',
              createdAt: '2018-11-21T20:49:28.192Z',
              docketNumber: '101-18',
              docketNumberSuffix: 'S',
              document: {
                createdAt: '2018-11-21T20:49:28.192Z',
                documentId: '413f62ce-d7c8-446e-aeda-14a2a625a626',
                documentType: 'Petition',
                filedBy: 'Test Taxpayer',
                userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
                workItems: [],
              },
              messages: [
                {
                  createdAt: '2018-11-21T20:49:28.192Z',
                  from: 'Test Taxpayer',
                  fromUserId: '6805d1ab-18d0-43ec-bafb-654e83405416',
                  message: 'Petition filed by Petitioner is ready for review.',
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
          filedBy: 'Test Taxpayer',
          userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
          workItems: [],
        },
        {
          caseId: '413f62ce-d7c8-446e-aeda-14a2a625a626',
          createdAt: '2018-11-21T20:49:28.192Z',
          documentId: '413f62ce-7c8d-446e-aeda-14a2a625a626',
          documentType: 'Ownership Disclosure Statement',
          filedBy: 'Test Taxpayer',
          userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
          workItems: [],
        },
      ],
      filingType: 'Myself',
      hasIrsNotice: true,
      irsNoticeDate: '2018-11-21T20:49:28.192Z',
      partyType: 'Petitioner',
      petitioners: [
        {
          name: 'Test Taxpayer',
          section: undefined,
          userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
        },
      ],
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

  it('should create a case entity without a irsNoticeDate and return it', async () => {
    const saveCaseStub = sinon.stub().callsFake(({ caseToSave }) => caseToSave);
    applicationContext = {
      docketNumberGenerator: {
        createDocketNumber: () => Promise.resolve(MOCK_DOCKET_NUMBER),
      },
      environment: { stage: 'local' },
      getCurrentUser: () => {
        return new User({
          name: 'Test Taxpayer',
          role: 'petitioner',
          userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
        });
      },
      getEntityConstructors: () => ({
        Petition: PetitionWithoutFiles,
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
          name: 'test taxpayer',
          phone: '(123) 456-7890',
        }),
      }),
    };

    const createdCase = await createCase({
      applicationContext,
      petitionFileId: '413f62ce-d7c8-446e-aeda-14a2a625a626',
      petitionMetadata: {
        caseType: 'other',
        contactPrimary: {
          name: 'Diana Prince',
        },
        filingType: 'Myself',
        hasIrsNotice: true,

        irsNoticeDate: DATE,
        partyType: 'Petitioner',
        preferredTrialCity: 'Chattanooga, TN',
        procedureType: 'Small',
      },
      stinFileId: '413f62ce-7c8d-446e-aeda-14a2a625a611',
    });

    const expectedCaseRecordToPersist = {
      caseId: '413f62ce-d7c8-446e-aeda-14a2a625a626',
      caseType: 'other',
      contactPrimary: {
        name: 'Diana Prince',
      },
      createdAt: '2018-11-21T20:49:28.192Z',
      docketNumber: '101-18',
      docketNumberSuffix: 'S',
      documents: [
        {
          caseId: '413f62ce-d7c8-446e-aeda-14a2a625a626',
          createdAt: '2018-11-21T20:49:28.192Z',
          documentId: '413f62ce-d7c8-446e-aeda-14a2a625a626',
          documentType: 'Petition',
          filedBy: 'Test Taxpayer',
          userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
          workItems: [
            {
              assigneeId: null,
              assigneeName: null,
              caseId: '413f62ce-d7c8-446e-aeda-14a2a625a626',
              caseStatus: 'New',
              createdAt: '2018-11-21T20:49:28.192Z',
              docketNumber: '101-18',
              docketNumberSuffix: 'S',
              document: {
                createdAt: '2018-11-21T20:49:28.192Z',
                documentId: '413f62ce-d7c8-446e-aeda-14a2a625a626',
                documentType: 'Petition',
                filedBy: 'Test Taxpayer',
                userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
                workItems: [],
              },
              messages: [
                {
                  createdAt: '2018-11-21T20:49:28.192Z',
                  from: 'Test Taxpayer',
                  fromUserId: '6805d1ab-18d0-43ec-bafb-654e83405416',
                  message: 'Petition filed by Petitioner is ready for review.',
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
          filedBy: 'Test Taxpayer',
          userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
          workItems: [],
        },
      ],
      filingType: 'Myself',
      hasIrsNotice: true,
      initialCaption:
        'Diana Prince, Petitioner v. Commissioner of Internal Revenue, Respondent',
      irsNoticeDate: '2018-11-21T20:49:28.192Z',
      partyType: 'Petitioner',

      petitioners: [
        {
          name: 'Test Taxpayer',
          section: undefined,
          userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
        },
      ],
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

  it('failure', async () => {
    applicationContext = {
      docketNumberGenerator: {
        createDocketNumber: () => Promise.resolve('00101-00'),
      },
      environment: { stage: 'local' },
      getCurrentUser: () => {
        return new User({
          name: 'Test Taxpayer',
          role: 'petitioner',
          userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
        });
      },
      getEntityConstructors: () => ({
        Petition: PetitionWithoutFiles,
      }),
      getPersistenceGateway: () => {
        return {
          saveCase: () => Promise.reject(new Error('problem')),
        };
      },
      getUseCases: () => ({
        getUser: () => ({
          name: 'john doe',
          userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        }),
      }),
    };
    try {
      await createCase({
        applicationContext,
        petitionFileId: '413f62ce-d7c8-446e-aeda-14a2a625a626',
        petitionMetadata: {
          caseType: 'other',
          contactPrimary: {
            name: 'Diana Prince',
          },
          filingType: 'Myself',
          hasIrsNotice: true,
          irsNoticeDate: DATE,
          partyType: 'Petitioner',
          preferredTrialCity: 'Chattanooga, TN',
          procedureType: 'Small',
        },
        stinFileId: '413f62ce-7c8d-446e-aeda-14a2a625a611',
      });
    } catch (error) {
      expect(error.message).toEqual('problem');
    }
  });

  it('throws an error if the entity returned from persistence is invalid', async () => {
    applicationContext = {
      docketNumberGenerator: {
        createDocketNumber: () => Promise.resolve('00101-00'),
      },
      environment: { stage: 'local' },
      getCurrentUser: () => {
        return new User({
          role: 'petitioner',
          userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
        });
      },
      getEntityConstructors: () => ({
        Petition: PetitionWithoutFiles,
      }),
      getPersistenceGateway: () => {
        return {
          saveCase: () =>
            Promise.resolve({
              caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
              docketNumber: '00101-00',
            }),
        };
      },
      getUseCases: () => ({
        getUser: () => ({
          name: 'john doe',
        }),
      }),
    };
    let error;
    try {
      await createCase({
        applicationContext,
        petitionFileId: null,
        petitionMetadata: {
          caseType: 'other',
          contactPrimary: {
            name: 'Diana Prince',
          },
          filingType: 'Myself',

          hasIrsNotice: true,
          irsNoticeDate: DATE,
          partyType: 'Petitioner',
          preferredTrialCity: 'Chattanooga, TN',
          procedureType: 'Small',
        },
        stinFileId: '413f62ce-7c8d-446e-aeda-14a2a625a611',
      });
    } catch (err) {
      error = err;
    }
    expect(error.message).toContain('The Document entity was invalid');
  });

  it('throws an error if the user is not valid or authorized', async () => {
    applicationContext = {
      getCurrentUser: () => {
        return {};
      },
    };
    let error;
    try {
      await createCase({
        applicationContext,
        petitionFileId: '413f62ce-d7c8-446e-aeda-14a2a625a626',
        petitionMetadata: {
          caseType: 'other',
          filingType: 'Myself',
          hasIrsNotice: true,
          irsNoticeDate: DATE,
          partyType: 'Petitioner',
          preferredTrialCity: 'Chattanooga, TN',
          procedureType: 'Small',
        },
        stinFileId: '413f62ce-7c8d-446e-aeda-14a2a625a611',
      });
    } catch (err) {
      error = err;
    }
    expect(error.message).toContain('Unauthorized');
  });
});
