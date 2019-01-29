const { createDocument } = require('./createDocument.interactor');
const sinon = require('sinon');
const uuid = require('uuid');
const User = require('../entities/User');
const PetitionWithoutFiles = require('../entities/PetitionWithoutFiles');

const MOCK_CASE = {
  userId: 'userId',
  caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
  docketNumber: '56789-18',
  petitioners: [{ name: 'Test Taxpayer' }],
  status: 'New',
  caseType: 'Other',
  procedureType: 'Regular',
  createdAt: new Date().toISOString(),
  preferredTrialCity: 'Washington, D.C.',
  documents: [],
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
      getPersistenceGateway: () => {
        return {
          getCaseByCaseId: () => MOCK_CASE,
          saveCase: saveCaseStub,
        };
      },
      getEntityConstructors: () => ({
        Petition: PetitionWithoutFiles,
      }),
      getCurrentUser: () => {
        return new User({ userId: 'respondent' });
      },
      environment: { stage: 'local' },
      docketNumberGenerator: {
        createDocketNumber: () => Promise.resolve(MOCK_DOCKET_NUMBER),
      },
    };

    await createDocument({
      caseId: '413f62ce-d7c8-446e-aeda-14a2a625a626',
      document: {
        documentType: 'Answer',
        documentId: '413f62ce-d7c8-446e-aeda-14a2a625a626',
      },
      applicationContext,
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
          filedBy: 'respondent',
          userId: 'respondent',
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
                  message: 'A Answer filed by Respondent is ready for review.',
                  messageId: '413f62ce-d7c8-446e-aeda-14a2a625a626',
                  sentBy: 'Test Respondent',
                  userId: 'respondent',
                },
              ],
            },
          ],
        },
      ],
    });
  });

  it('should create a document when a use is not a respondent', async () => {
    const saveCaseStub = sinon.stub().callsFake(({ caseToSave }) => caseToSave);
    applicationContext = {
      getPersistenceGateway: () => {
        return {
          getCaseByCaseId: () => MOCK_CASE,
          saveCase: saveCaseStub,
        };
      },
      getEntityConstructors: () => ({
        Petition: PetitionWithoutFiles,
      }),
      getCurrentUser: () => {
        return new User({ userId: 'taxpayer' });
      },
      environment: { stage: 'local' },
      docketNumberGenerator: {
        createDocketNumber: () => Promise.resolve(MOCK_DOCKET_NUMBER),
      },
    };

    await createDocument({
      caseId: '413f62ce-d7c8-446e-aeda-14a2a625a626',
      document: {
        documentType: 'Answer',
        documentId: '413f62ce-d7c8-446e-aeda-14a2a625a626',
      },
      applicationContext,
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
          filedBy: 'petitioner',
          userId: 'taxpayer',
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
                  message: 'A Answer filed by Petitioner is ready for review.',
                  messageId: '413f62ce-d7c8-446e-aeda-14a2a625a626',
                  sentBy: 'Test Taxpayer',
                  userId: 'taxpayer',
                },
              ],
            },
          ],
        },
      ],
    });
  });
});
