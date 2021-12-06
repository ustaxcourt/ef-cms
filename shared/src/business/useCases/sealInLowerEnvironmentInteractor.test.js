const {
  sealInLowerEnvironmentInteractor,
} = require('./sealInLowerEnvironmentInteractor');
const { applicationContext } = require('../test/createTestApplicationContext');
const { MOCK_CASE } = require('../../test/mockCase');
const { ROLES } = require('../entities/EntityConstants');

describe('sealInLowerEnvironmentInteractor', () => {
  beforeAll(() => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(MOCK_CASE);
    applicationContext.getNotificationGateway().sendNotificationOfSealing =
      jest.fn();
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.docketClerk,
      userId: 'docketClerk',
    });
  });

  it('should seal the case with the docketNumber provided and return the updated case', async () => {
    const result = await sealInLowerEnvironmentInteractor(applicationContext, {
      docketNumber: MOCK_CASE.docketNumber,
    });
    expect(applicationContext.getUseCases().sealCaseInteractor).toBeCalled();
    expect(result.sealedDate).toBeTruthy();
  });

  it('should only log a warning if we do not have a docketNumber', async () => {
    await sealInLowerEnvironmentInteractor(applicationContext, {});
    expect(
      applicationContext.getUseCases().sealCaseInteractor,
    ).not.toBeCalled();
    expect(applicationContext.logger.warn).toBeCalled();
  });
});
