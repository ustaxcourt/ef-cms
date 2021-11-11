const { applicationContext } = require('../test/createTestApplicationContext');
const { MOCK_CASE } = require('../../test/mockCase');
const { ROLES } = require('../entities/EntityConstants');
const { unsealCaseInteractor } = require('./unsealCaseInteractor');

describe('unsealCaseInteractor', () => {
  beforeAll(() => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(MOCK_CASE);
  });

  it('should throw an error if the user is unauthorized to unseal a case', async () => {
    await expect(
      unsealCaseInteractor(applicationContext, {
        docketNumber: MOCK_CASE.docketNumber,
        qcCompleteForTrial: true,
        trialSessionId: '10aa100f-0330-442b-8423-b01690c76e3f',
      }),
    ).rejects.toThrow('Unauthorized for unsealing cases');
  });

  it('should call updateCase with isSealed set to false and return the updated case', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.docketClerk,
      userId: 'docketClerk',
    });

    const result = await unsealCaseInteractor(applicationContext, {
      docketNumber: MOCK_CASE.docketNumber,
    });
    expect(result.isSealed).toBe(false);
  });
});
