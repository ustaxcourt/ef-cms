const { MOCK_CASE } = require('../../test/mockCase');
const { unblockCaseInteractor } = require('./unblockCaseInteractor');
const { User } = require('../entities/User');

describe('unblockCaseInteractor', () => {
  let applicationContext;
  let createCaseTrialSortMappingRecordsMock = jest.fn();

  it('should set the blocked flag to false and remove the blockedReason', async () => {
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
          createCaseTrialSortMappingRecords: createCaseTrialSortMappingRecordsMock,
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
    expect(createCaseTrialSortMappingRecordsMock).toHaveBeenCalled();
    expect(
      createCaseTrialSortMappingRecordsMock.mock.calls[0][0].caseId,
    ).toEqual(MOCK_CASE.caseId);
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
