import { MOCK_CASE } from '../../test/mockCase';
import { ROLES } from '../entities/EntityConstants';
import { applicationContext } from '../test/createTestApplicationContext';
import { sealInLowerEnvironment } from './sealInLowerEnvironment';

describe('sealInLowerEnvironment', () => {
  beforeAll(() => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(MOCK_CASE);
    applicationContext.getNotificationGateway().sendNotificationOfSealing =
      jest.fn();
    applicationContext.isCurrentColorActive = jest.fn().mockReturnValue(true);
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.docketClerk,
    });
  });

  it('should seal the case with the docketNumber provided and return the updated case', async () => {
    const result = await sealInLowerEnvironment(applicationContext, [
      {
        docketNumber: MOCK_CASE.docketNumber,
      },
    ]);
    expect(
      applicationContext.getUseCases().sealCaseInteractor,
    ).toHaveBeenCalled();
    expect(result[0].sealedDate).toBeTruthy();
  });

  it('should only log a warning if we do not have a docketNumber', async () => {
    await sealInLowerEnvironment(applicationContext, [{}]);
    expect(
      applicationContext.getUseCases().sealCaseInteractor,
    ).not.toHaveBeenCalled();
    expect(applicationContext.logger.warn).toHaveBeenCalled();
  });

  it('should not execute if the current color is not active', async () => {
    applicationContext.isCurrentColorActive = jest.fn().mockReturnValue(false);
    await sealInLowerEnvironment(applicationContext, [
      {
        docketNumber: '123-21',
      },
    ]);
    expect(
      applicationContext.getUseCases().sealCaseInteractor,
    ).not.toHaveBeenCalled();
  });
});
