const { applicationContext } = require('../test/createTestApplicationContext');
const { CASE_STATUS_TYPES } = require('../entities/EntityConstants');
const { MOCK_CASE } = require('../../test/mockCase');
const { prioritizeCaseInteractor } = require('./prioritizeCaseInteractor');
const { ROLES } = require('../entities/EntityConstants');

describe('prioritizeCaseInteractor', () => {
  it('should update the case with the highPriority flag set as true and attach a reason', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.petitionsClerk,
      userId: 'petitionsclerk',
    });
    applicationContext
      .getPersistenceGateway()
      .getCaseByCaseId.mockReturnValue(Promise.resolve(MOCK_CASE));

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
      applicationContext.getPersistenceGateway()
        .updateHighPriorityCaseTrialSortMappingRecords,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway()
        .updateHighPriorityCaseTrialSortMappingRecords.mock.calls[0][0].caseId,
    ).toEqual(MOCK_CASE.caseId);
  });

  it('should throw an unauthorized error if the user has no access to prioritize cases', async () => {
    applicationContext.getCurrentUser.mockReturnValue({});

    await expect(
      prioritizeCaseInteractor({
        applicationContext,
        caseId: '123',
      }),
    ).rejects.toThrow('Unauthorized');
  });

  it('should throw an error if the case status is calendared', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.petitionsClerk,
      userId: 'petitionsclerk',
    });
    applicationContext.getPersistenceGateway().getCaseByCaseId.mockReturnValue(
      Promise.resolve({
        ...MOCK_CASE,
        status: CASE_STATUS_TYPES.calendared,
      }),
    );

    await expect(
      prioritizeCaseInteractor({
        applicationContext,
        caseId: MOCK_CASE.caseId,
        reason: 'just because',
      }),
    ).rejects.toThrow('Cannot set a calendared case as high priority');
  });

  it('should throw an error if the case is blocked', async () => {
    applicationContext.getPersistenceGateway().getCaseByCaseId.mockReturnValue(
      Promise.resolve({
        ...MOCK_CASE,
        blocked: true,
        blockedDate: '2019-08-16T17:29:10.132Z',
        blockedReason: 'something',
      }),
    );

    await expect(
      prioritizeCaseInteractor({
        applicationContext,
        caseId: MOCK_CASE.caseId,
        reason: 'just because',
      }),
    ).rejects.toThrow('Cannot set a blocked case as high priority');
  });
});
