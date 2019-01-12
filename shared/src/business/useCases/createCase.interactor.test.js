const { createCase } = require('./createCase.interactor');
const { MOCK_DOCUMENTS } = require('../../test/mockDocuments');
const sinon = require('sinon');
const uuid = require('uuid');
const User = require('../entities/User');
const PetitionWithoutFiles = require('../entities/PetitionWithoutFiles');

describe('createCase', () => {
  let applicationContext;
  let documents = MOCK_DOCUMENTS;
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
    const createCaseStub = sinon
      .stub()
      .callsFake(({ caseRecord }) => caseRecord);
    applicationContext = {
      getPersistenceGateway: () => {
        return {
          createCase: createCaseStub,
        };
      },
      getEntityConstructors: () => ({
        Petition: PetitionWithoutFiles,
      }),
      getCurrentUser: () => {
        return new User({ userId: 'taxpayer' });
      },
      getUseCases: () => ({
        getUser: () => ({
          address: '123',
          email: 'test@example.com',
          name: 'test taxpayer',
          phone: '(123) 456-7890',
        }),
      }),
      environment: { stage: 'local' },
      docketNumberGenerator: {
        createDocketNumber: () => Promise.resolve(MOCK_DOCKET_NUMBER),
      },
    };

    const createdCase = await createCase({
      petition: {
        caseType: 'other',
        procedureType: 'Small',
        preferredTrialCity: 'Chattanooga, TN',
        irsNoticeDate: DATE,
      },
      documents: documents,
      applicationContext,
    });

    const expectedCaseRecordToPersist = {
      caseId: MOCK_CASE_ID,
      docketNumber: '101-18',
      irsNoticeDate: DATE,
      caseTitle:
        'Test Taxpayer, Petitioner(s) v. Commissioner of Internal Revenue, Respondent',
      petitioners: [
        {
          email: 'testtaxpayer@example.com',
          name: 'Test Taxpayer',
          phone: '111-111-1111',
        },
      ],
      documents: [
        {
          documentId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
          documentType: 'Petition',
          createdAt: DATE,
          userId: 'taxpayer',
          filedBy: 'Petitioner Test Taxpayer',
          reviewDate: DATE,
          reviewUser: 'petitionsclerk',
          workItems: [],
        },
        {
          documentId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
          documentType: 'Statement of Taxpayer Identification Number',
          createdAt: DATE,
          userId: 'taxpayer',
          filedBy: 'Petitioner Test Taxpayer',
          reviewDate: DATE,
          reviewUser: 'petitionsclerk',
          workItems: [],
        },
        {
          documentId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
          documentType: 'Request for Place of Trial',
          createdAt: DATE,
          userId: 'taxpayer',
          filedBy: 'Petitioner Test Taxpayer',
          reviewDate: DATE,
          reviewUser: 'petitionsclerk',
          workItems: [],
        },
      ],
      createdAt: DATE,
      status: 'new',
      userId: 'taxpayer',
    };
    const caseRecordSentToPersistence = createCaseStub.getCall(0).args[0]
      .caseRecord;
    expect(createdCase).toMatchObject(expectedCaseRecordToPersist);
    expect(createdCase).toMatchObject(caseRecordSentToPersistence);
  });

  it('should create a case entity without a irsNoticeDate and return it', async () => {
    const createCaseStub = sinon
      .stub()
      .callsFake(({ caseRecord }) => caseRecord);
    applicationContext = {
      getPersistenceGateway: () => {
        return {
          createCase: createCaseStub,
        };
      },
      getEntityConstructors: () => ({
        Petition: PetitionWithoutFiles,
      }),
      getCurrentUser: () => {
        return new User({ userId: 'taxpayer' });
      },
      getUseCases: () => ({
        getUser: () => ({
          address: '123',
          email: 'test@example.com',
          name: 'test taxpayer',
          phone: '(123) 456-7890',
        }),
      }),
      environment: { stage: 'local' },
      docketNumberGenerator: {
        createDocketNumber: () => Promise.resolve(MOCK_DOCKET_NUMBER),
      },
    };

    const createdCase = await createCase({
      petition: {
        caseType: 'other',
        procedureType: 'Small',
        preferredTrialCity: 'Chattanooga, TN',
      },
      documents: documents,
      applicationContext,
    });

    const expectedCaseRecordToPersist = {
      caseId: MOCK_CASE_ID,
      docketNumber: '101-18',
      caseTitle:
        'Test Taxpayer, Petitioner(s) v. Commissioner of Internal Revenue, Respondent',
      petitioners: [
        {
          email: 'testtaxpayer@example.com',
          name: 'Test Taxpayer',
          phone: '111-111-1111',
        },
      ],
      documents: [
        {
          documentId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
          documentType: 'Petition',
          createdAt: DATE,
          userId: 'taxpayer',
          filedBy: 'Petitioner Test Taxpayer',
          reviewDate: DATE,
          reviewUser: 'petitionsclerk',
          workItems: [],
        },
        {
          documentId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
          documentType: 'Statement of Taxpayer Identification Number',
          createdAt: DATE,
          userId: 'taxpayer',
          filedBy: 'Petitioner Test Taxpayer',
          reviewDate: DATE,
          reviewUser: 'petitionsclerk',
          workItems: [],
        },
        {
          documentId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
          documentType: 'Request for Place of Trial',
          createdAt: DATE,
          userId: 'taxpayer',
          filedBy: 'Petitioner Test Taxpayer',
          reviewDate: DATE,
          reviewUser: 'petitionsclerk',
          workItems: [],
        },
      ],
      preferredTrialCity: 'Chattanooga, TN',
      procedureType: 'Small',
      createdAt: DATE,
      status: 'new',
      userId: 'taxpayer',
    };
    const caseRecordSentToPersistence = createCaseStub.getCall(0).args[0]
      .caseRecord;
    expect(createdCase).toMatchObject(expectedCaseRecordToPersist);
    expect(createdCase).toMatchObject(caseRecordSentToPersistence);
  });

  it('failure', async () => {
    applicationContext = {
      getPersistenceGateway: () => {
        return {
          createCase: () => Promise.reject(new Error('problem')),
        };
      },
      getCurrentUser: () => {
        return new User({ userId: 'taxpayer' });
      },
      getEntityConstructors: () => ({
        Petition: PetitionWithoutFiles,
      }),
      getUseCases: () => ({
        getUser: () => ({
          name: 'john doe',
          userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        }),
      }),
      environment: { stage: 'local' },
      docketNumberGenerator: {
        createDocketNumber: () => Promise.resolve('00101-00'),
      },
    };
    try {
      await createCase({
        petition: {
          caseType: 'other',
          procedureType: 'Small',
          preferredTrialCity: 'Chattanooga, TN',
          irsNoticeDate: DATE,
        },
        documents: documents,
        applicationContext,
      });
    } catch (error) {
      expect(error.message).toEqual('problem');
    }
  });

  it('throws an error if the entity returned from persistence is invalid', async () => {
    applicationContext = {
      getPersistenceGateway: () => {
        return {
          createCase: () =>
            Promise.resolve({
              docketNumber: '00101-00',
              caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
            }),
        };
      },
      getEntityConstructors: () => ({
        Petition: PetitionWithoutFiles,
      }),
      getCurrentUser: () => {
        return new User({ userId: 'taxpayer' });
      },
      getUseCases: () => ({
        getUser: () => ({
          name: 'john doe',
        }),
      }),
      docketNumberGenerator: {
        createDocketNumber: () => Promise.resolve('00101-00'),
      },
      environment: { stage: 'local' },
    };
    let error;
    try {
      await createCase({
        petition: {
          caseType: 'other',
          procedureType: 'Small',
          preferredTrialCity: 'Chattanooga, TN',
          irsNoticeDate: DATE,
        },
        documents,
        applicationContext,
      });
    } catch (err) {
      error = err;
    }
    expect(error.message).toContain('The entity was invalid');
  });
  it('throws an error if the user is not valid or authorized', async () => {
    applicationContext = {
      getCurrentUser: () => {
        return new User({ userId: 'docketclerk' });
      },
    };
    let error;
    try {
      await createCase({
        documents,
        applicationContext,
      });
    } catch (err) {
      error = err;
    }
    expect(error.message).toContain('Unauthorized');
  });
});
