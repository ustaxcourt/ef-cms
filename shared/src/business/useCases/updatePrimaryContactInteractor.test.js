const {
  updatePrimaryContactInteractor,
} = require('./updatePrimaryContactInteractor');
const { MOCK_CASE } = require('../../test/mockCase');
const { User } = require('../entities/User');

const updateCaseStub = jest.fn();
let persistenceGateway = {
  getCaseByCaseId: () => MOCK_CASE,
  updateCase: updateCaseStub,
};
const applicationContext = {
  environment: { stage: 'local' },
  getCurrentUser: () => {
    return new User({
      name: 'bob',
      role: 'petitioner',
      userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    });
  },
  getPersistenceGateway: () => {
    return persistenceGateway;
  },
  getUtilities: () => {
    return {
      createISODateString: () => '2018-06-01T00:00:00.000Z',
    };
  },
};

describe('update primary contact on a case', () => {
  it('updates contactPrimary', async () => {
    await updatePrimaryContactInteractor({
      applicationContext,
      caseId: 'abc',
      contactInfo: {},
    });
    expect(updateCaseStub).toHaveBeenCalled();
  });

  it('throws an error if the case was not found', async () => {
    persistenceGateway.getCaseByCaseId = async () => null;
    let error = null;
    try {
      await updatePrimaryContactInteractor({
        applicationContext,
        caseId: 'abc',
        contactInfo: {},
      });
    } catch (err) {
      error = err;
    }
    expect(error.message).toEqual('Case abc was not found.');
  });

  it('throws an error if the case user id is not equal to the user making the request', async () => {
    persistenceGateway.getCaseByCaseId = async () => ({
      ...MOCK_CASE,
      userId: '123',
    });
    let error = null;
    try {
      await updatePrimaryContactInteractor({
        applicationContext,
        caseId: 'abc',
        contactInfo: {},
      });
    } catch (err) {
      error = err;
    }
    expect(error.message).toEqual('Unauthorized for update case contact');
  });
});
