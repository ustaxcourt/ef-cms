import '@web-api/persistence/postgres/cases/mocks.jest';
import '@web-api/persistence/postgres/workitems/mocks.jest';
import { MOCK_CASE } from '../../../../shared/src/test/mockCase';
import { applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { mockDocketClerkUser } from '@shared/test/mockAuthUsers';
import { sealInLowerEnvironment } from './sealInLowerEnvironment';

describe('sealInLowerEnvironment', () => {
  beforeAll(() => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(MOCK_CASE);
    applicationContext.getNotificationGateway().sendNotificationOfSealing =
      jest.fn();
    applicationContext.isCurrentColorActive = jest.fn().mockReturnValue(true);
  });

  it('should seal the case with the docketNumber provided and return the updated case', async () => {
    const result = await sealInLowerEnvironment(
      applicationContext,
      [
        {
          docketNumber: MOCK_CASE.docketNumber,
        },
      ],
      mockDocketClerkUser,
    );

    expect(
      applicationContext.getUseCases().sealCaseInteractor,
    ).toHaveBeenCalled();
    expect(result[0].sealedDate).toBeTruthy();
  });

  it('should only log a warning if we do not have a docketNumber', async () => {
    await sealInLowerEnvironment(applicationContext, [{}], mockDocketClerkUser);

    expect(
      applicationContext.getUseCases().sealCaseInteractor,
    ).not.toHaveBeenCalled();
    expect(applicationContext.logger.warn).toHaveBeenCalled();
  });

  it('should not execute if the current color is not active', async () => {
    applicationContext.isCurrentColorActive = jest.fn().mockReturnValue(false);

    await sealInLowerEnvironment(
      applicationContext,
      [
        {
          docketNumber: '123-21',
        },
      ],
      mockDocketClerkUser,
    );

    expect(
      applicationContext.getUseCases().sealCaseInteractor,
    ).not.toHaveBeenCalled();
  });
});
