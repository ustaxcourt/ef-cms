const { prioritizeCaseInteractor } = require('./prioritizeCaseInteractor');
const { MOCK_CASE } = require('../../test/mockCase');

describe('prioritizeCaseInteractor', () => {
  let applicationContext;

  it('should update the case with the highPriority flag set as true and attach a reason', async () => {
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
    const result = await prioritizeCaseInteractor({
      applicationContext,
      caseId: MOCK_CASE.caseId,
      reason: 'just because',
    });
    expect(result).toMatchObject({
      highPriority: true,
      highPriorityReason: 'just because',
    });
  });

  it('should throw an unauthorized error if the user has no access to prioritize cases', async () => {
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
      await prioritizeCaseInteractor({
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
