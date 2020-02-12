const { MOCK_CASE } = require('../../test/mockCase');
const { sealCaseInteractor } = require('./sealCaseInteractor');
const { User } = require('../entities/User');

describe('sealCaseInteractor', () => {
  let applicationContext;

  it('should throw an error if the user is unauthorized to seal a case', async () => {
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
      sealCaseInteractor({
        applicationContext,
        caseId: MOCK_CASE.caseId,
        qcCompleteForTrial: true,
        trialSessionId: '10aa100f-0330-442b-8423-b01690c76e3f',
      }),
    ).rejects.toThrow('Unauthorized for sealing cases');
  });

  it('should call updateCase with the sealedDate set on the case and return the updated case', async () => {
    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => {
        return {
          role: User.ROLES.docketClerk, // user has SEAL_CASE permission
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
    const result = await sealCaseInteractor({
      applicationContext,
      caseId: MOCK_CASE.caseId,
    });
    expect(result.sealedDate).toBeTruthy();
  });
});
