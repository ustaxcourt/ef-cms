const {
  updateQcCompleteForTrialInteractor,
} = require('./updateQcCompleteForTrialInteractor');
const { MOCK_CASE } = require('../../test/mockCase');
const { User } = require('../entities/User');

describe('updateQcCompleteForTrialInteractor', () => {
  let applicationContext;

  it('should throw an error if the user is unauthorized to update a trial session', async () => {
    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => {
        return {
          role: User.ROLES.petitioner,
          userId: 'petitioner',
        };
      },
      getPersistenceGateway: () => {
        return {
          getCaseByCaseId: () => Promise.resolve(MOCK_CASE),
          updateCase: caseToUpdate => Promise.resolve(caseToUpdate),
        };
      },
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
    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => {
        return {
          role: User.ROLES.petitionsClerk,
          userId: 'petitionsClerk',
        };
      },
      getPersistenceGateway: () => {
        return {
          getCaseByCaseId: () => Promise.resolve(MOCK_CASE),
          updateCase: ({ caseToUpdate }) => Promise.resolve(caseToUpdate),
        };
      },
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
