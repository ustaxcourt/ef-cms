const sinon = require('sinon');
const uuid = require('uuid');
const {
  createCaseFromPaperInteractor,
} = require('./createCaseFromPaperInteractor');
const { Case } = require('../entities/cases/Case');
const { CaseInternal } = require('../entities/cases/CaseInternal');
const { ContactFactory } = require('../entities/contacts/ContactFactory');
const { UnauthorizedError } = require('../../errors/errors');
const { User } = require('../entities/User');

describe('createCaseFromPaperInteractor', () => {
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

  it('throws an error if the user is not valid or authorized', async () => {
    applicationContext = {
      getCurrentUser: () => {
        return {};
      },
      getUniqueId: () => 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    };
    let error;
    try {
      await createCaseFromPaperInteractor({ applicationContext });
    } catch (err) {
      error = err;
    }
    expect(error.message).toContain('Unauthorized');
    expect(error).toBeInstanceOf(UnauthorizedError);
  });

  it('creates a case from paper', async () => {
    applicationContext = {
      docketNumberGenerator: {
        createDocketNumber: () => Promise.resolve('00101-00'),
      },
      environment: { stage: 'local' },
      getCurrentUser: () =>
        new User({
          name: 'Test Petitionsclerk',
          role: User.ROLES.petitionsClerk,
          userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
        }),
      getEntityConstructors: () => ({
        CaseInternal,
      }),
      getPersistenceGateway: () => ({
        createCase: async () => null,
        getUserById: () => ({
          name: 'Test Petitionsclerk',
          role: User.ROLES.petitionsClerk,
          section: 'petitions',
          userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
        }),
        saveWorkItemForPaper: async () => null,
      }),
      getUniqueId: () => 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      getUseCases: () => ({
        getUserInteractor: () => ({
          name: 'john doe',
          userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        }),
      }),
    };

    let error;
    let caseFromPaper;

    try {
      caseFromPaper = await createCaseFromPaperInteractor({
        applicationContext,
        ownershipDisclosureFileId: '413f62ce-7c8d-446e-aeda-14a2a625a611',
        petitionFileId: '413f62ce-d7c8-446e-aeda-14a2a625a626',
        petitionMetadata: {
          caseCaption: 'caseCaption',
          caseType: 'Other',
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
          mailingDate: 'testing',
          partyType: ContactFactory.PARTY_TYPES.petitioner,
          petitionFile: new File([], 'petitionFile.pdf'),
          petitionFileSize: 1,
          preferredTrialCity: 'Fresno, California',
          procedureType: 'Small',
          receivedAt: new Date().toISOString(),
          requestForPlaceOfTrialFile: new File(
            [],
            'requestForPlaceOfTrialFile.pdf',
          ),
          requestForPlaceOfTrialFileSize: 1,
          stinFile: new File([], 'stinFile.pdf'),
          stinFileSize: 1,
        },
        requestForPlaceOfTrialFileId: '413f62ce-7c8d-446e-aeda-14a2a625a611',
        stinFileId: '413f62ce-7c8d-446e-aeda-14a2a625a611',
      });
    } catch (e) {
      error = e;
    }

    expect(error).toBeUndefined();
    expect(caseFromPaper).toBeDefined();
  });

  it('creates a case from paper with a secondary contact', async () => {
    applicationContext = {
      docketNumberGenerator: {
        createDocketNumber: () => Promise.resolve('00101-00'),
      },
      environment: { stage: 'local' },
      getCurrentUser: () =>
        new User({
          name: 'Test Petitionsclerk',
          role: User.ROLES.petitionsClerk,
          userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
        }),
      getEntityConstructors: () => ({
        CaseInternal,
      }),
      getPersistenceGateway: () => ({
        createCase: async () => null,
        getUserById: () => ({
          name: 'Test Petitionsclerk',
          role: User.ROLES.petitionsClerk,
          section: 'petitions',
          userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
        }),
        saveWorkItemForPaper: async () => null,
      }),
      getUniqueId: () => 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      getUseCases: () => ({
        getUserInteractor: () => ({
          name: 'john doe',
          userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        }),
      }),
    };

    let error;
    let caseFromPaper;

    try {
      caseFromPaper = await createCaseFromPaperInteractor({
        applicationContext,
        ownershipDisclosureFileId: '413f62ce-7c8d-446e-aeda-14a2a625a611',
        petitionFileId: '413f62ce-d7c8-446e-aeda-14a2a625a626',
        petitionMetadata: {
          caseCaption: 'caseCaption',
          caseType: 'Other',
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
          contactSecondary: { name: 'Bob Prince' },
          filingType: 'Myself',
          hasIrsNotice: true,
          irsNoticeDate: DATE,
          mailingDate: 'test',
          partyType: ContactFactory.PARTY_TYPES.petitioner,
          petitionFile: new File([], 'petitionFile.pdf'),
          petitionFileSize: 1,
          preferredTrialCity: 'Fresno, California',
          procedureType: 'Small',
          receivedAt: new Date().toISOString(),
          requestForPlaceOfTrialFile: new File(
            [],
            'requestForPlaceOfTrialFile.pdf',
          ),
          requestForPlaceOfTrialFileSize: 1,
          stinFile: new File([], 'stinFile.pdf'),
          stinFileSize: 1,
        },
        requestForPlaceOfTrialFileId: '413f62ce-7c8d-446e-aeda-14a2a625a611',
        stinFileId: '413f62ce-7c8d-446e-aeda-14a2a625a611',
      });
    } catch (e) {
      error = e;
    }

    expect(error).toBeUndefined();
    expect(caseFromPaper).toBeDefined();
  });

  it('creates a case from paper with a request for place of trial and preferred trial city', async () => {
    applicationContext = {
      docketNumberGenerator: {
        createDocketNumber: () => Promise.resolve('00101-00'),
      },
      environment: { stage: 'local' },
      getCurrentUser: () =>
        new User({
          name: 'Test Petitionsclerk',
          role: User.ROLES.petitionsClerk,
          userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
        }),
      getEntityConstructors: () => ({
        CaseInternal,
      }),
      getPersistenceGateway: () => ({
        createCase: async () => null,
        getUserById: () => ({
          name: 'Test Petitionsclerk',
          role: User.ROLES.petitionsClerk,
          section: 'petitions',
          userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
        }),
        saveWorkItemForPaper: async () => null,
      }),
      getUniqueId: () => 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      getUseCases: () => ({
        getUserInteractor: () => ({
          name: 'john doe',
          userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        }),
      }),
    };

    let error;
    let caseFromPaper;

    try {
      caseFromPaper = await createCaseFromPaperInteractor({
        applicationContext,
        ownershipDisclosureFileId: '413f62ce-7c8d-446e-aeda-14a2a625a611',
        petitionFileId: '413f62ce-d7c8-446e-aeda-14a2a625a626',
        petitionMetadata: {
          caseCaption: 'caseCaption',
          caseType: 'Other',
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
          mailingDate: 'testing',
          partyType: ContactFactory.PARTY_TYPES.petitioner,
          petitionFile: new File([], 'petitionFile.pdf'),
          petitionFileSize: 1,
          preferredTrialCity: 'Fresno, California',
          procedureType: 'Small',
          receivedAt: new Date().toISOString(),
          requestForPlaceOfTrialFile: new File(
            [],
            'requestForPlaceOfTrialFile.pdf',
          ),
          requestForPlaceOfTrialFileSize: 1,
          stinFile: new File([], 'stinFile.pdf'),
          stinFileSize: 1,
        },
        requestForPlaceOfTrialFileId: '413f62ce-7c8d-446e-aeda-14a2a625a611',
        stinFileId: '413f62ce-7c8d-446e-aeda-14a2a625a611',
      });
    } catch (e) {
      error = e;
    }

    expect(error).toBeUndefined();
    expect(caseFromPaper).toBeDefined();
  });

  it('creates a case from paper with Application for Waiver of Filing Fee', async () => {
    applicationContext = {
      docketNumberGenerator: {
        createDocketNumber: () => Promise.resolve('00101-00'),
      },
      environment: { stage: 'local' },
      getCurrentUser: () =>
        new User({
          name: 'Test Petitionsclerk',
          role: User.ROLES.petitionsClerk,
          userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
        }),
      getEntityConstructors: () => ({
        CaseInternal,
      }),
      getPersistenceGateway: () => ({
        createCase: async () => null,
        getUserById: () => ({
          name: 'Test Petitionsclerk',
          role: User.ROLES.petitionsClerk,
          section: 'petitions',
          userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
        }),
        saveWorkItemForPaper: async () => null,
      }),
      getUniqueId: () => 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      getUseCases: () => ({
        getUserInteractor: () => ({
          name: 'john doe',
          userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        }),
      }),
    };

    let error;
    let caseFromPaper;

    try {
      caseFromPaper = await createCaseFromPaperInteractor({
        applicationContext,
        applicationForWaiverOfFilingFeeFileId:
          '413f62ce-7c8d-446e-aeda-14a2a625a611',
        petitionFileId: '413f62ce-d7c8-446e-aeda-14a2a625a626',
        petitionMetadata: {
          caseCaption: 'caseCaption',
          caseType: 'Other',
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
          mailingDate: 'testing',
          partyType: ContactFactory.PARTY_TYPES.petitioner,
          petitionFile: new File([], 'petitionFile.pdf'),
          petitionFileSize: 1,
          preferredTrialCity: 'Fresno, California',
          procedureType: 'Small',
          receivedAt: new Date().toISOString(),
          requestForPlaceOfTrialFile: new File(
            [],
            'requestForPlaceOfTrialFile.pdf',
          ),
          requestForPlaceOfTrialFileSize: 1,
          stinFile: new File([], 'stinFile.pdf'),
          stinFileSize: 1,
        },
        stinFileId: '413f62ce-7c8d-446e-aeda-14a2a625a611',
      });
    } catch (e) {
      error = e;
    }

    expect(error).toBeUndefined();
    expect(caseFromPaper).toBeDefined();
  });

  it('creates a case from paper with a provided case status', async () => {
    applicationContext = {
      docketNumberGenerator: {
        createDocketNumber: () => Promise.resolve('00101-00'),
      },
      environment: { stage: 'local' },
      getCurrentUser: () =>
        new User({
          name: 'Test Petitionsclerk',
          role: User.ROLES.petitionsClerk,
          userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
        }),
      getEntityConstructors: () => ({
        CaseInternal,
      }),
      getPersistenceGateway: () => ({
        createCase: async () => null,
        getUserById: () => ({
          name: 'Test Petitionsclerk',
          role: User.ROLES.petitionsClerk,
          section: 'petitions',
          userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
        }),
        saveWorkItemForPaper: async () => null,
      }),
      getUniqueId: () => 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      getUseCases: () => ({
        getUserInteractor: () => ({
          name: 'john doe',
          userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        }),
      }),
    };

    let error;
    let caseFromPaper;

    try {
      caseFromPaper = await createCaseFromPaperInteractor({
        applicationContext,
        ownershipDisclosureFileId: '413f62ce-7c8d-446e-aeda-14a2a625a611',
        petitionFileId: '413f62ce-d7c8-446e-aeda-14a2a625a626',
        petitionMetadata: {
          caseCaption: 'caseCaption',
          caseType: 'Other',
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
          mailingDate: 'testing',
          partyType: ContactFactory.PARTY_TYPES.petitioner,
          petitionFile: new File([], 'petitionFile.pdf'),
          petitionFileSize: 1,
          preferredTrialCity: 'Fresno, California',
          procedureType: 'Small',
          receivedAt: new Date().toISOString(),
          requestForPlaceOfTrialFile: new File(
            [],
            'requestForPlaceOfTrialFile.pdf',
          ),
          requestForPlaceOfTrialFileSize: 1,
          status: Case.STATUS_TYPES.inProgress,
          stinFile: new File([], 'stinFile.pdf'),
          stinFileSize: 1,
        },
        requestForPlaceOfTrialFileId: '413f62ce-7c8d-446e-aeda-14a2a625a611',
        stinFileId: '413f62ce-7c8d-446e-aeda-14a2a625a611',
      });
    } catch (e) {
      error = e;
    }

    expect(error).toBeUndefined();
    expect(caseFromPaper).toBeDefined();
    expect(caseFromPaper.status).toEqual(Case.STATUS_TYPES.inProgress);
  });
});
