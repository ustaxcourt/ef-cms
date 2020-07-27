const {
  blockCaseFromTrialInteractor,
} = require('./blockCaseFromTrialInteractor');
const { applicationContext } = require('../test/createTestApplicationContext');
const { MOCK_CASE } = require('../../test/mockCase');
const { ROLES } = require('../entities/EntityConstants');

describe('blockCaseFromTrialInteractor', () => {
  beforeEach(() => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.petitionsClerk,
      userId: 'petitionsclerk',
    });
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(MOCK_CASE);
    applicationContext
      .getPersistenceGateway()
      .updateCase.mockImplementation(({ caseToUpdate }) => caseToUpdate);
  });

  it('should update the case with the blocked flag set as true and attach a reason', async () => {
    const result = await blockCaseFromTrialInteractor({
      applicationContext,
      docketNumber: MOCK_CASE.docketNumber,
      reason: 'just because',
    });

    expect(result).toMatchObject({
      blocked: true,
      blockedReason: 'just because',
    });
    expect(
      applicationContext.getPersistenceGateway()
        .deleteCaseTrialSortMappingRecords,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway()
        .deleteCaseTrialSortMappingRecords.mock.calls[0][0].caseId,
    ).toEqual(MOCK_CASE.caseId);
  });

  it('should throw an unauthorized error if the user has no access to block cases', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: 'nope',
      userId: 'nope',
    });

    await expect(
      blockCaseFromTrialInteractor({
        applicationContext,
        docketNumber: '123-45',
      }),
    ).rejects.toThrow('Unauthorized');
  });
});
