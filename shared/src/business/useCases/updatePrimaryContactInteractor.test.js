const {
  updatePrimaryContactInteractor,
} = require('./updatePrimaryContactInteractor');
const { MOCK_CASE } = require('../../test/mockCase');
const { User } = require('../entities/User');

const updateCaseStub = jest.fn();
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
    return {
      getCaseByCaseId: () => MOCK_CASE,
      updateCase: updateCaseStub,
    };
  },
};

describe('Updates contactPrimary on the given case', () => {
  it('updates contactPrimary', async () => {
    await updatePrimaryContactInteractor({
      applicationContext,
      caseToUpdate: MOCK_CASE,
    });
    expect(updateCaseStub).toHaveBeenCalled();
  });
});
