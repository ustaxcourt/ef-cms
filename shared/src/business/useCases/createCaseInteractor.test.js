const sinon = require('sinon');
const uuid = require('uuid');
const {
  CaseExternalIncomplete,
} = require('../entities/cases/CaseExternalIncomplete');
const { CaseExternal } = require('../entities/cases/CaseExternal');
const { createCaseInteractor } = require('./createCaseInteractor');
const { User } = require('../entities/User');

describe('createCaseInteractor', () => {
  let applicationContext;
  const MOCK_CASE_ID = '413f62ce-d7c8-446e-aeda-14a2a625a626';
  const DATE = '2018-11-21T20:49:28.192Z';

  beforeEach(() => {
    sinon.stub(uuid, 'v4').returns(MOCK_CASE_ID);
    sinon.stub(window.Date.prototype, 'toISOString').returns(DATE);
  });

  afterEach(() => {
    window.Date.prototype.toISOString.restore();
    uuid.v4.restore();
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
        CaseExternal: CaseExternalIncomplete,
      }),
      getPersistenceGateway: () => {
        return {
          createCase: async () => null,
          saveWorkItemForNonPaper: async () => null,
        };
      },
      getUseCases: () => ({
        getUserInteractor: () => ({
          name: 'john doe',
          userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        }),
      }),
    };
    try {
      await createCaseInteractor({
        applicationContext,
        petitionFileId: '413f62ce-d7c8-446e-aeda-14a2a625a626',
        petitionMetadata: {
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
        },
        stinFileId: '413f62ce-7c8d-446e-aeda-14a2a625a611',
      });
    } catch (error) {
      expect(error.message).toEqual('problem');
    }
  });

  it('throws an error if the user is not valid or authorized', async () => {
    applicationContext = {
      getCurrentUser: () => {
        return {};
      },
    };
    let error;
    try {
      await createCaseInteractor({
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

  it('should create a case successfully as a petitioner', async () => {
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
        CaseExternal,
      }),
      getPersistenceGateway: () => {
        return {
          createCase: async () => null,
          saveWorkItemForNonPaper: async () => null,
        };
      },
      getUseCases: () => ({
        getUserInteractor: () => ({
          name: 'john doe',
          userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        }),
      }),
    };

    let error;
    let result;

    try {
      result = await createCaseInteractor({
        applicationContext,
        ownershipDisclosureFileId: '413f62ce-7c8d-446e-aeda-14a2a625a611',
        petitionFileId: '413f62ce-d7c8-446e-aeda-14a2a625a626',
        petitionMetadata: {
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
          petitionFile: new File([], 'test.pdf'),
          petitionFileSize: 1,
          preferredTrialCity: 'Chattanooga, TN',
          procedureType: 'Small',
          signature: true,
          stinFile: new File([], 'test.pdf'),
          stinFileSize: 1,
        },
        stinFileId: '413f62ce-7c8d-446e-aeda-14a2a625a611',
      });
    } catch (e) {
      error = e;
    }

    expect(error).toBeUndefined();
    expect(result).toBeDefined();
  });

  it('should create a case successfully as a practitioner', async () => {
    const practitionerUser = new User({
      name: 'Olivia Jade',
      role: 'practitioner',
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });

    applicationContext = {
      docketNumberGenerator: {
        createDocketNumber: () => Promise.resolve('00101-00'),
      },
      environment: { stage: 'local' },
      getCurrentUser: () => practitionerUser,
      getEntityConstructors: () => ({
        CaseExternal,
      }),
      getPersistenceGateway: () => {
        return {
          createCase: async () => null,
          getUserById: async () => practitionerUser,
          saveWorkItemForNonPaper: async () => null,
        };
      },
      getUseCases: () => ({
        getUserInteractor: () => ({
          name: 'john doe',
          userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        }),
      }),
    };

    let error;
    let result;

    try {
      result = await createCaseInteractor({
        applicationContext,
        ownershipDisclosureFileId: '413f62ce-7c8d-446e-aeda-14a2a625a611',
        petitionFileId: '413f62ce-d7c8-446e-aeda-14a2a625a626',
        petitionMetadata: {
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
          petitionFile: new File([], 'test.pdf'),
          petitionFileSize: 1,
          preferredTrialCity: 'Chattanooga, TN',
          procedureType: 'Small',
          signature: true,
          stinFile: new File([], 'test.pdf'),
          stinFileSize: 1,
        },
        stinFileId: '413f62ce-7c8d-446e-aeda-14a2a625a611',
      });
    } catch (e) {
      error = e;
    }

    expect(error).toBeUndefined();
    expect(result).toBeDefined();
  });
});
