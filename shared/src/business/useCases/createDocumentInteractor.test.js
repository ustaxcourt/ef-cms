const { createDocument } = require('./createDocumentInteractor');
const sinon = require('sinon');
const uuid = require('uuid');
const User = require('../entities/User');
const PetitionWithoutFiles = require('../entities/PetitionWithoutFiles');

const MOCK_CASE = {
  caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
  caseType: 'Other',
  createdAt: new Date().toISOString(),
  docketNumber: '56789-18',
  documents: [],
  filingType: 'Myself',
  hasIrsNotice: false,
  partyType: 'Petitioner',
  petitioners: [{ name: 'Test Taxpayer' }],
  preferredTrialCity: 'Washington, D.C.',
  procedureType: 'Regular',
  status: 'New',
  userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
};
describe('createDocument', () => {
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

  it('should create a document', async () => {
    const saveCaseStub = sinon.stub().callsFake(({ caseToSave }) => caseToSave);
    applicationContext = {
      docketNumberGenerator: {
        createDocketNumber: () => Promise.resolve(MOCK_DOCKET_NUMBER),
      },
      environment: { stage: 'local' },
      getCurrentUser: () => {
        return new User({
          name: 'Test Respondent',
          role: 'respondent',
          userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
        });
      },
      getEntityConstructors: () => ({
        Petition: PetitionWithoutFiles,
      }),
      getPersistenceGateway: () => {
        return {
          getCaseByCaseId: () => MOCK_CASE,
          saveCase: saveCaseStub,
        };
      },
    };

    await createDocument({
      applicationContext,
      caseId: '413f62ce-d7c8-446e-aeda-14a2a625a626',
      document: {
        documentId: '413f62ce-d7c8-446e-aeda-14a2a625a626',
        documentType: 'Answer',
      },
    });
    const caseRecordSentToPersistence = saveCaseStub.getCall(0).args[0]
      .caseToSave;
    expect(caseRecordSentToPersistence).toMatchObject({
      ...MOCK_CASE,
      documents: [
        {
          caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
          createdAt: '2018-11-21T20:49:28.192Z',
          documentId: '413f62ce-d7c8-446e-aeda-14a2a625a626',
          documentType: 'Answer',
          filedBy: 'Test Respondent',
          userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
          workItems: [
            {
              assigneeId: null,
              assigneeName: null,
              caseId: '413f62ce-d7c8-446e-aeda-14a2a625a626',
              caseStatus: 'New',
              createdAt: '2018-11-21T20:49:28.192Z',
              docketNumber: '56789-18',
              docketNumberSuffix: undefined,
              document: {
                createdAt: '2018-11-21T20:49:28.192Z',
                documentId: '413f62ce-d7c8-446e-aeda-14a2a625a626',
                documentType: 'Answer',
              },
              messages: [
                {
                  createdAt: '2018-11-21T20:49:28.192Z',
                  from: 'Test Respondent',
                  fromUserId: '6805d1ab-18d0-43ec-bafb-654e83405416',
                  message: 'Answer filed by Respondent is ready for review.',
                  messageId: '413f62ce-d7c8-446e-aeda-14a2a625a626',
                },
              ],
            },
          ],
        },
      ],
    });
  });

  it('should create a document when a user is not a respondent', async () => {
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
          getCaseByCaseId: () => MOCK_CASE,
          saveCase: saveCaseStub,
        };
      },
    };

    await createDocument({
      applicationContext,
      caseId: '413f62ce-d7c8-446e-aeda-14a2a625a626',
      document: {
        documentId: '413f62ce-d7c8-446e-aeda-14a2a625a626',
        documentType: 'Answer',
      },
    });
    const caseRecordSentToPersistence = saveCaseStub.getCall(0).args[0]
      .caseToSave;
    expect(caseRecordSentToPersistence).toMatchObject({
      ...MOCK_CASE,
      documents: [
        {
          caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
          createdAt: '2018-11-21T20:49:28.192Z',
          documentId: '413f62ce-d7c8-446e-aeda-14a2a625a626',
          documentType: 'Answer',
          filedBy: 'Test Taxpayer',
          userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
          workItems: [
            {
              assigneeId: null,
              assigneeName: null,
              caseId: '413f62ce-d7c8-446e-aeda-14a2a625a626',
              caseStatus: 'New',
              createdAt: '2018-11-21T20:49:28.192Z',
              docketNumber: '56789-18',
              docketNumberSuffix: undefined,
              document: {
                createdAt: '2018-11-21T20:49:28.192Z',
                documentId: '413f62ce-d7c8-446e-aeda-14a2a625a626',
                documentType: 'Answer',
              },
              messages: [
                {
                  createdAt: '2018-11-21T20:49:28.192Z',
                  from: 'Test Taxpayer',
                  fromUserId: '6805d1ab-18d0-43ec-bafb-654e83405416',
                  message: 'Answer filed by Petitioner is ready for review.',
                  messageId: '413f62ce-d7c8-446e-aeda-14a2a625a626',
                },
              ],
            },
          ],
        },
      ],
    });
  });
});
