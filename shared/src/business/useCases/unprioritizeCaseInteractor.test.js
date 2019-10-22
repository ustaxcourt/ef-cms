const { unprioritizeCaseInteractor } = require('./unprioritizeCaseInteractor');
const { MOCK_CASE } = require('../../test/mockCase');
const { User } = require('../entities/User');

describe('unprioritizeCaseInteractor', () => {
  let applicationContext;
  let updateCaseTrialSortMappingRecordsMock = jest.fn();

  it('should set the highPriority flag to false and remove the highPriorityReason', async () => {
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
              highPriority: true,
              highPriorityReason: 'because',
            }),
          updateCase: ({ caseToUpdate }) => caseToUpdate,
          updateCaseTrialSortMappingRecords: updateCaseTrialSortMappingRecordsMock,
        };
      },
    };
    const result = await unprioritizeCaseInteractor({
      applicationContext,
      caseId: MOCK_CASE.caseId,
    });
    expect(result).toMatchObject({
      highPriority: false,
      highPriorityReason: undefined,
    });
    expect(updateCaseTrialSortMappingRecordsMock).toHaveBeenCalled();
    expect(
      updateCaseTrialSortMappingRecordsMock.mock.calls[0][0].caseId,
    ).toEqual(MOCK_CASE.caseId);
  });

  it('should throw an unauthorized error if the user has no access to unprioritize the case', async () => {
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
      await unprioritizeCaseInteractor({
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
