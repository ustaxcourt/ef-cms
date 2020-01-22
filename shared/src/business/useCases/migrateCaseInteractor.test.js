const uuid = require('uuid');
const { ContactFactory } = require('../entities/contacts/ContactFactory');
const { migrateCaseInteractor } = require('./migrateCaseInteractor');
const { MOCK_CASE } = require('../../test/mockCase.js');
const { User } = require('../entities/User');

const MOCK_CASE_ID = '413f62ce-d7c8-446e-aeda-14a2a625a626';
const DATE = '2018-11-21T20:49:28.192Z';

let applicationContext;
let adminUser;
let caseMetadata;
let getCurrentUserMock;
let getUserByIdMock;
let createCaseMock;
let createdCases;

describe('migrateCaseInteractor', () => {
  beforeEach(() => {
    uuid.v4 = jest.fn(() => MOCK_CASE_ID);
    window.Date.prototype.toISOString = jest.fn(() => DATE);

    adminUser = new User({
      name: 'Olivia Jade',
      role: 'admin',
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });

    getCurrentUserMock = jest.fn(() => adminUser);

    getUserByIdMock = jest.fn(() => ({
      ...adminUser,
      section: 'admin',
    }));

    createdCases = [];
    createCaseMock = jest.fn(({ caseToCreate }) => {
      createdCases.push(caseToCreate);
    });

    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: getCurrentUserMock,
      getPersistenceGateway: () => {
        return {
          createCase: createCaseMock,
          getUserById: getUserByIdMock,
        };
      },
      getUniqueId: () => 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      getUseCases: () => ({
        getUserInteractor: () => ({
          name: 'john doe',
          userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        }),
      }),
    };

    caseMetadata = {
      caseType: 'Other',
      contactPrimary: {
        address1: '99 South Oak Lane',
        address2: 'Address 2',
        address3: 'Address 3',
        city: 'Some City',
        countryType: 'domestic',
        email: 'petitioner1@example.com',
        name: 'Diana Prince',
        phone: '+1 (215) 128-6587',
        postalCode: '69580',
        state: 'AR',
      },
      contactSecondary: {},
      docketNumber: '00101-00',
      docketRecord: MOCK_CASE.docketRecord,
      documents: MOCK_CASE.documents,
      filingType: 'Myself',
      hasIrsNotice: true,
      partyType: ContactFactory.PARTY_TYPES.petitioner,
      petitionFile: new File([], 'test.pdf'),
      petitionFileSize: 1,
      preferredTrialCity: 'Fresno, California',
      procedureType: 'Small',
      signature: true,
      stinFile: new File([], 'test.pdf'),
      stinFileSize: 1,
    };
  });

  it('should get the current user from applicationContext', async () => {
    await migrateCaseInteractor({
      applicationContext,
      caseMetadata,
    });

    expect(getCurrentUserMock).toHaveBeenCalled();
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
      await migrateCaseInteractor({
        applicationContext,
        caseMetadata: {
          caseType: 'Other',
          docketNumber: '00101-00',
          filingType: 'Myself',
          hasIrsNotice: true,
          partyType: ContactFactory.PARTY_TYPES.petitioner,
          preferredTrialCity: 'Fresno, California',
          procedureType: 'Small',
        },
      });
    } catch (err) {
      error = err;
    }
    expect(error.message).toContain('Unauthorized');
  });

  it('should pull the current user record from persistence', async () => {
    await migrateCaseInteractor({
      applicationContext,
      caseMetadata,
    });

    expect(getUserByIdMock).toHaveBeenCalled();
  });

  it('should create a case successfully', async () => {
    let error;
    let result;

    expect(createdCases.length).toEqual(0);

    try {
      result = await migrateCaseInteractor({
        applicationContext,
        caseMetadata,
      });
    } catch (e) {
      error = e;
    }

    expect(error).toBeUndefined();
    expect(result).toBeDefined();
    expect(createCaseMock).toHaveBeenCalled();
    expect(createdCases.length).toEqual(1);
  });

  describe('validation', () => {
    it('should fail to migrate a case when the case is invalid', async () => {
      let error;

      try {
        await migrateCaseInteractor({
          applicationContext,
          caseMetadata: {},
        });
      } catch (e) {
        error = e;
      }

      expect(error.message).toContain('The Case entity was invalid');
    });

    it('should fail to migrate a case when the docket record is invalid', async () => {
      let error;

      try {
        await migrateCaseInteractor({
          applicationContext,
          caseMetadata: {
            ...caseMetadata,
            docketRecord: [{}],
          },
        });
      } catch (e) {
        error = e;
      }

      expect(error.message).toContain('The DocketRecord entity was invalid');
    });
  });
});
