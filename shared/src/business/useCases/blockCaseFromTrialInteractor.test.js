const {
  blockCaseFromTrialInteractor,
} = require('./blockCaseFromTrialInteractor');
const { MOCK_CASE } = require('../../test/mockCase');
const { User } = require('../entities/User');

describe('blockCaseFromTrialInteractor', () => {
  let applicationContext;
  let deleteCaseTrialSortMappingRecordsMock = jest.fn();

  it('should update the case with the blocked flag set as true and attach a reason', async () => {
    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => {
        return {
          role: User.ROLES.petitionsClerk,
          userId: 'petitionsclerk',
        };
      },
      getPersistenceGateway: () => {
        return {
          deleteCaseTrialSortMappingRecords: deleteCaseTrialSortMappingRecordsMock,
          getCaseByCaseId: () => Promise.resolve(MOCK_CASE),
          updateCase: ({ caseToUpdate }) => caseToUpdate,
        };
      },
    };
    const result = await blockCaseFromTrialInteractor({
      applicationContext,
      caseId: MOCK_CASE.caseId,
      reason: 'just because',
    });
    expect(result).toMatchObject({
      blocked: true,
      blockedReason: 'just because',
    });
    expect(deleteCaseTrialSortMappingRecordsMock).toHaveBeenCalled();
    expect(
      deleteCaseTrialSortMappingRecordsMock.mock.calls[0][0].caseId,
    ).toEqual(MOCK_CASE.caseId);
  });

  it('should throw an unauthorized error if the user has no access to block cases', async () => {
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
      await blockCaseFromTrialInteractor({
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
