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
      .getCaseByDocketNumber.mockReturnValue(
        Promise.resolve({
          ...MOCK_CASE,
          status: CASE_STATUS_TYPES.generalDocketReadyForTrial,
        }),
      );

    const result = await prioritizeCaseInteractor(applicationContext, {
      docketNumber: MOCK_CASE.docketNumber,
      reason: 'just because',
    });

    expect(result).toMatchObject({
      highPriority: true,
      highPriorityReason: 'just because',
    });
    expect(
      applicationContext.getPersistenceGateway()
        .createCaseTrialSortMappingRecords,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway()
        .createCaseTrialSortMappingRecords.mock.calls[0][0].docketNumber,
    ).toEqual(MOCK_CASE.docketNumber);
  });

  it('should update trial sort mapping records when status is other than "General Docket - At Issue (Ready for Trial)"', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.petitionsClerk,
      userId: 'petitionsclerk',
    });
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(
        Promise.resolve({
          ...MOCK_CASE,
          status: CASE_STATUS_TYPES.rule155,
        }),
      );

    await prioritizeCaseInteractor(applicationContext, {
      docketNumber: MOCK_CASE.docketNumber,
      reason: 'just because',
    });

    expect(
      applicationContext.getPersistenceGateway()
        .createCaseTrialSortMappingRecords,
    ).toHaveBeenCalled();
  });

  it('should throw an unauthorized error if the user has no access to prioritize cases', async () => {
    applicationContext.getCurrentUser.mockReturnValue({});

    await expect(
      prioritizeCaseInteractor(applicationContext, {
        docketNumber: '123-20',
      }),
    ).rejects.toThrow('Unauthorized');
  });

  it('should throw an error if the case status is calendared', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.petitionsClerk,
      userId: 'petitionsclerk',
    });
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(
        Promise.resolve({
          ...MOCK_CASE,
          status: CASE_STATUS_TYPES.calendared,
        }),
      );

    await expect(
      prioritizeCaseInteractor(applicationContext, {
        docketNumber: MOCK_CASE.docketNumber,
        reason: 'just because',
      }),
    ).rejects.toThrow('Cannot set a calendared case as high priority');
  });

  it('should throw an error if the case is blocked', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(
        Promise.resolve({
          ...MOCK_CASE,
          blocked: true,
          blockedDate: '2019-08-16T17:29:10.132Z',
          blockedReason: 'something',
        }),
      );

    await expect(
      prioritizeCaseInteractor(applicationContext, {
        docketNumber: MOCK_CASE.docketNumber,
        reason: 'just because',
      }),
    ).rejects.toThrow('Cannot set a blocked case as high priority');
  });

  it('should not call createCaseTrialSortMappingRecords if the case is missing a trial city', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(
        Promise.resolve({
          ...MOCK_CASE,
          preferredTrialCity: null,
        }),
      );

    await prioritizeCaseInteractor(applicationContext, {
      docketNumber: MOCK_CASE.docketNumber,
      reason: 'just because',
    });
    expect(
      applicationContext.getPersistenceGateway()
        .createCaseTrialSortMappingRecords,
    ).not.toHaveBeenCalled();
  });

  it('should update trial sort mapping records when automaticBlocked and high priority', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.petitionsClerk,
      userId: 'petitionsclerk',
    });
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(
        Promise.resolve({
          ...MOCK_CASE,
          automaticBlocked: true,
          automaticBlockedDate: '2019-11-30T09:10:11.000Z',
          automaticBlockedReason: 'Pending Item',
          status: CASE_STATUS_TYPES.rule155,
        }),
      );

    await prioritizeCaseInteractor(applicationContext, {
      docketNumber: MOCK_CASE.docketNumber,
      reason: 'just because',
    });

    expect(
      applicationContext.getPersistenceGateway()
        .createCaseTrialSortMappingRecords,
    ).toHaveBeenCalled();
  });
});
