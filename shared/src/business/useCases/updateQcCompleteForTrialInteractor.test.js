const {
  updateQcCompleteForTrialInteractor,
} = require('./updateQcCompleteForTrialInteractor');
const { applicationContext } = require('../test/createTestApplicationContext');
const { MOCK_CASE } = require('../../test/mockCase');
const { User } = require('../entities/User');

describe('updateQcCompleteForTrialInteractor', () => {
  let user;

  beforeEach(() => {
    applicationContext.getCurrentUser.mockImplementation(() => user);
    applicationContext
      .getPersistenceGateway()
      .getCaseByCaseId.mockResolvedValue(MOCK_CASE);
    applicationContext
      .getPersistenceGateway()
      .updateCase.mockImplementation(({ caseToUpdate }) =>
        Promise.resolve(caseToUpdate),
      );
  });

  it('should throw an error if the user is unauthorized to update a trial session', async () => {
    user = {
      role: User.ROLES.petitioner,
      userId: 'petitioner',
    };

    await expect(
      updateQcCompleteForTrialInteractor({
        applicationContext,
        caseId: MOCK_CASE.caseId,
        qcCompleteForTrial: true,
        trialSessionId: '10aa100f-0330-442b-8423-b01690c76e3f',
      }),
    ).rejects.toThrow('Unauthorized for trial session QC complete');
  });

  it('should call updateCase with the updated qcCompleteForTrial value and return the updated case', async () => {
    user = {
      role: User.ROLES.petitionsClerk,
      userId: 'petitionsClerk',
    };

    const result = await updateQcCompleteForTrialInteractor({
      applicationContext,
      caseId: MOCK_CASE.caseId,
      qcCompleteForTrial: true,
      trialSessionId: '10aa100f-0330-442b-8423-b01690c76e3f',
    });
    expect(result.qcCompleteForTrial).toEqual({
      '10aa100f-0330-442b-8423-b01690c76e3f': true,
    });
  });
});
