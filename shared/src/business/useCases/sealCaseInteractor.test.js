const { applicationContext } = require('../test/createTestApplicationContext');
const { MOCK_CASE } = require('../../test/mockCase');
const { ROLES } = require('../entities/EntityConstants');
const { sealCaseInteractor } = require('./sealCaseInteractor');

describe('sealCaseInteractor', () => {
  beforeAll(() => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByCaseId.mockReturnValue(MOCK_CASE);
  });

  it('should throw an error if the user is unauthorized to seal a case', async () => {
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
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.docketClerk,
      userId: 'docketClerk',
    });

    const result = await sealCaseInteractor({
      applicationContext,
      caseId: MOCK_CASE.caseId,
    });
    expect(result.sealedDate).toBeTruthy();
  });
});
