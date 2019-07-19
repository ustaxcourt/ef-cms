const {
  serveSignedStipDecisionInteractor,
} = require('./serveSignedStipDecisionInteractor');
const { MOCK_CASE } = require('../../test/mockCase');
const { User } = require('../entities/User');
let updatedCase;

const updateCaseStub = jest.fn();
const applicationContext = {
  environment: { stage: 'local' },
  getCurrentUser: () => {
    return new User({
      name: 'bob',
      role: 'docketclerk',
      userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    });
  },
  getPersistenceGateway: () => {
    return {
      getCaseByCaseId: () => MOCK_CASE,
      updateCase: ({ caseToUpdate }) => {
        updatedCase = caseToUpdate;
        updateCaseStub();
      },
    };
  },
  getUtilities: () => {
    return {
      createISODateString: () => '2018-06-01T00:00:00.000Z',
    };
  },
};

describe('Serves Signed Stipulated Decsion on all parties', () => {
  it('updates case status to closed', async () => {
    await serveSignedStipDecisionInteractor({
      applicationContext,
      caseId: MOCK_CASE.caseId,
      documentId: '123',
    });
    expect(updateCaseStub).toHaveBeenCalled();
    expect(updatedCase.status).toEqual('Closed');
  });
});
