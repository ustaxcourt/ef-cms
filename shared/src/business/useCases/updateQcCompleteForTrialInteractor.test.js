const {
  updateQcCompleteForTrialInteractor,
} = require('./updateQcCompleteForTrialInteractor');
const { Case } = require('../entities/cases/Case');
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
        caseStatus: Case.STATUS_TYPES.cav,
      }),
    ).rejects.toThrow('Unauthorized for trial sessions');
  });

  it('should call updateCase with the updated qcCompleteForTrial value and return the updated case', async () => {
    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => {
        return {
          role: User.ROLES.docketClerk,
          userId: 'docketClerk',
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
    });
    expect(result.qcCompleteForTrial).toEqual(true);
  });
});
