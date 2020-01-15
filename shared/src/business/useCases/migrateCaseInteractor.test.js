const sinon = require('sinon');
const uuid = require('uuid');
const { ContactFactory } = require('../entities/contacts/ContactFactory');
const { migrateCaseInteractor } = require('./migrateCaseInteractor');
const { User } = require('../entities/User');

describe('migrateCaseInteractor', () => {
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
      await migrateCaseInteractor({
        applicationContext,
        caseMetadata: {
          caseType: 'other',
          docketNumber: '00101-00',
          filingType: 'Myself',
          hasIrsNotice: true,
          partyType: ContactFactory.PARTY_TYPES.petitioner,
          preferredTrialCity: 'Chattanooga, TN',
          procedureType: 'Small',
        },
      });
    } catch (err) {
      error = err;
    }
    expect(error.message).toContain('Unauthorized');
  });

  it('should create a case successfully as a admin', async () => {
    const adminUser = new User({
      name: 'Olivia Jade',
      role: 'admin',
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });

    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => adminUser,
      getPersistenceGateway: () => {
        return {
          createCase: async () => null,
          getUserById: () => ({
            ...adminUser,
            section: 'admin',
          }),
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

    let error;
    let result;

    try {
      result = await migrateCaseInteractor({
        applicationContext,
        caseMetadata: {
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
          docketNumber: '00101-00',
          filingType: 'Myself',
          hasIrsNotice: true,
          partyType: ContactFactory.PARTY_TYPES.petitioner,
          petitionFile: new File([], 'test.pdf'),
          petitionFileSize: 1,
          preferredTrialCity: 'Chattanooga, TN',
          procedureType: 'Small',
          signature: true,
          stinFile: new File([], 'test.pdf'),
          stinFileSize: 1,
        },
      });
    } catch (e) {
      error = e;
    }

    expect(error).toBeUndefined();
    expect(result).toBeDefined();
  });
});
