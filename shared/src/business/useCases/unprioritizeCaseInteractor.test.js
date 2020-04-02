const { applicationContext } = require('../test/createTestApplicationContext');
const { Case } = require('../entities/cases/Case');
const { MOCK_CASE } = require('../../test/mockCase');
const { unprioritizeCaseInteractor } = require('./unprioritizeCaseInteractor');
const { User } = require('../entities/User');

describe('unprioritizeCaseInteractor', () => {
  beforeAll(() => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: User.ROLES.petitionsClerk,
      userId: 'petitionsclerk',
    });
  });

  it('should set the highPriority flag to false and remove the highPriorityReason and call updateCaseTrialSortMappingRecords if the case status is ready for trial', async () => {
    applicationContext.getPersistenceGateway().getCaseByCaseId.mockReturnValue(
      Promise.resolve({
        ...MOCK_CASE,
        highPriority: true,
        highPriorityReason: 'because',
        status: Case.STATUS_TYPES.generalDocketReadyForTrial,
      }),
    );

    const result = await unprioritizeCaseInteractor({
      applicationContext,
      caseId: MOCK_CASE.caseId,
    });

    expect(result).toMatchObject({
      highPriority: false,
      highPriorityReason: undefined,
    });
    expect(
      applicationContext.getPersistenceGateway()
        .deleteCaseTrialSortMappingRecords,
    ).not.toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway()
        .updateCaseTrialSortMappingRecords,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway()
        .updateCaseTrialSortMappingRecords.mock.calls[0][0].caseId,
    ).toEqual(MOCK_CASE.caseId);
  });

  it('should set the highPriority flag to false and remove the highPriorityReason and call deleteCaseTrialSortMappingRecords if the case status is NOT ready for trial', async () => {
    applicationContext.getPersistenceGateway().getCaseByCaseId.mockReturnValue(
      Promise.resolve({
        ...MOCK_CASE,
        highPriority: true,
        highPriorityReason: 'because',
        status: Case.STATUS_TYPES.new,
      }),
    );

    const result = await unprioritizeCaseInteractor({
      applicationContext,
      caseId: MOCK_CASE.caseId,
    });

    expect(result).toMatchObject({
      highPriority: false,
      highPriorityReason: undefined,
    });
    expect(
      applicationContext.getPersistenceGateway()
        .updateCaseTrialSortMappingRecords,
    ).not.toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway()
        .deleteCaseTrialSortMappingRecords,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway()
        .deleteCaseTrialSortMappingRecords.mock.calls[0][0].caseId,
    ).toEqual(MOCK_CASE.caseId);
  });

  it('should throw an unauthorized error if the user has no access to unprioritize the case', async () => {
    applicationContext.getCurrentUser.mockReturnValue({});

    await expect(
      unprioritizeCaseInteractor({
        applicationContext,
        caseId: '123',
      }),
    ).rejects.toThrow('Unauthorized');
  });
});
