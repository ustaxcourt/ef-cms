const { Case } = require('../entities/cases/Case');
const { MOCK_CASE } = require('../../test/mockCase');
const { prioritizeCaseInteractor } = require('./prioritizeCaseInteractor');
const { User } = require('../entities/User');

describe('prioritizeCaseInteractor', () => {
  let applicationContext;
  let updateHighPriorityCaseTrialSortMappingRecordsMock = jest.fn();

  it('should update the case with the highPriority flag set as true and attach a reason', async () => {
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
          getCaseByCaseId: () => Promise.resolve(MOCK_CASE),
          updateCase: ({ caseToUpdate }) => caseToUpdate,
          updateHighPriorityCaseTrialSortMappingRecords: updateHighPriorityCaseTrialSortMappingRecordsMock,
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
    expect(
      updateHighPriorityCaseTrialSortMappingRecordsMock,
    ).toHaveBeenCalled();
    expect(
      updateHighPriorityCaseTrialSortMappingRecordsMock.mock.calls[0][0].caseId,
    ).toEqual(MOCK_CASE.caseId);
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

  it('should throw an error if the case status is calendared', async () => {
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
          getCaseByCaseId: () =>
            Promise.resolve({
              ...MOCK_CASE,
              status: Case.STATUS_TYPES.calendared,
            }),
          updateCase: ({ caseToUpdate }) => caseToUpdate,
          updateHighPriorityCaseTrialSortMappingRecords: updateHighPriorityCaseTrialSortMappingRecordsMock,
        };
      },
    };
    let error;
    try {
      await prioritizeCaseInteractor({
        applicationContext,
        caseId: MOCK_CASE.caseId,
        reason: 'just because',
      });
    } catch (err) {
      error = err;
    }
    expect(error).not.toBeNull();
    expect(error.message).toEqual(
      'Cannot set a calendared case as high priority',
    );
  });

  it('should throw an error if the case is blocked', async () => {
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
          getCaseByCaseId: () =>
            Promise.resolve({
              ...MOCK_CASE,
              blocked: true,
              blockedDate: '2019-08-16T17:29:10.132Z',
              blockedReason: 'something',
            }),
          updateCase: ({ caseToUpdate }) => caseToUpdate,
          updateHighPriorityCaseTrialSortMappingRecords: updateHighPriorityCaseTrialSortMappingRecordsMock,
        };
      },
    };
    let error;
    try {
      await prioritizeCaseInteractor({
        applicationContext,
        caseId: MOCK_CASE.caseId,
        reason: 'just because',
      });
    } catch (err) {
      error = err;
    }
    expect(error).not.toBeNull();
    expect(error.message).toEqual('Cannot set a blocked case as high priority');
  });
});
