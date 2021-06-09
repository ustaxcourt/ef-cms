const {
  unblockCaseFromTrialInteractor,
} = require('./unblockCaseFromTrialInteractor');
const { applicationContext } = require('../test/createTestApplicationContext');
const { CASE_STATUS_TYPES } = require('../entities/EntityConstants');
const { MOCK_CASE } = require('../../test/mockCase');
const { ROLES } = require('../entities/EntityConstants');

describe('unblockCaseFromTrialInteractor', () => {
  it('should set the blocked flag to false and remove the blockedReason', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.petitionsClerk,
      userId: '7ad8dcbc-5978-4a29-8c41-02422b66f410',
    });
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(
        Promise.resolve({
          ...MOCK_CASE,
          status: CASE_STATUS_TYPES.generalDocketReadyForTrial,
        }),
      );
    applicationContext
      .getPersistenceGateway()
      .getFullCaseByDocketNumber.mockReturnValue(
        Promise.resolve({
          ...MOCK_CASE,
          status: CASE_STATUS_TYPES.generalDocketReadyForTrial,
        }),
      );

    const result = await unblockCaseFromTrialInteractor(applicationContext, {
      docketNumber: MOCK_CASE.docketNumber,
      reason: 'just because',
    });

    expect(result).toMatchObject({
      blocked: false,
      blockedReason: undefined,
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

  it('should throw an unauthorized error if the user has no access to unblock the case', async () => {
    applicationContext.getCurrentUser.mockReturnValue({});

    await expect(
      unblockCaseFromTrialInteractor(applicationContext, {
        docketNumber: '123-45',
      }),
    ).rejects.toThrow('Unauthorized');
  });

  it('should not create the trial sort mapping record if the case has no trial city', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.petitionsClerk,
      userId: '7ad8dcbc-5978-4a29-8c41-02422b66f410',
    });

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(
        Promise.resolve({
          ...MOCK_CASE,
          preferredTrialCity: null,
          status: CASE_STATUS_TYPES.generalDocketReadyForTrial,
        }),
      );

    await unblockCaseFromTrialInteractor(applicationContext, {
      docketNumber: '123-45',
    });

    expect(
      applicationContext.getPersistenceGateway()
        .createCaseTrialSortMappingRecords,
    ).not.toHaveBeenCalled();
  });
});
