const { unblockCaseInteractor } = require('./unblockCaseInteractor');
const { MOCK_CASE } = require('../../test/mockCase');

describe('unblockCaseInteractor', () => {
  let applicationContext;

  it('should set the blocked flag to false and remove the blockedReason', async () => {
    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => {
        return {
          role: 'petitionsclerk',
          userId: 'petitionsclerk',
        };
      },
      getPersistenceGateway: () => {
        return {
          getCaseByCaseId: () => Promise.resolve(MOCK_CASE),
          updateCase: ({ caseToUpdate }) => caseToUpdate,
        };
      },
    };
    const result = await unblockCaseInteractor({
      applicationContext,
      caseId: MOCK_CASE.caseId,
      reason: 'just because',
    });
    expect(result).toMatchObject({
      blocked: false,
      blockedReason: undefined,
    });
  });

  it('should throw an unauthorized error if the user has no access to unblock the case', async () => {
    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => {
        return {
          role: 'nope',
          userId: 'nope',
        };
      },
    };
    let error;
    try {
      await unblockCaseInteractor({
        applicationContext,
        caseId: '123',
      });
    } catch (err) {
      error = err;
    }
    expect(error).not.toBeNull();
    expect(error.message).toContain('Unauthorized');
  });
});
