const { applicationContext } = require('../test/createTestApplicationContext');
const { CASE_STATUS_TYPES } = require('../entities/EntityConstants');
const { MOCK_CASE } = require('../../test/mockCase');
const { ROLES } = require('../entities/EntityConstants');
const { unprioritizeCaseInteractor } = require('./unprioritizeCaseInteractor');

describe('unprioritizeCaseInteractor', () => {
  beforeAll(() => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.petitionsClerk,
      userId: '7ad8dcbc-5978-4a29-8c41-02422b66f410',
    });
  });

  it('should set the highPriority flag to false and remove the highPriorityReason and call updateCaseTrialSortMappingRecords if the case status is ready for trial', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(
        Promise.resolve({
          ...MOCK_CASE,
          highPriority: true,
          highPriorityReason: 'because',
          status: CASE_STATUS_TYPES.generalDocketReadyForTrial,
        }),
      );

    const result = await unprioritizeCaseInteractor({
      applicationContext,
      docketNumber: MOCK_CASE.docketNumber,
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
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(
        Promise.resolve({
          ...MOCK_CASE,
          highPriority: true,
          highPriorityReason: 'because',
          status: CASE_STATUS_TYPES.new,
        }),
      );

    const result = await unprioritizeCaseInteractor({
      applicationContext,
      docketNumber: MOCK_CASE.docketNumber,
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
        docketNumber: '123-20',
      }),
    ).rejects.toThrow('Unauthorized');
  });
});
