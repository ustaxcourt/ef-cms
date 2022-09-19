import { applicationContext } from '../test/createTestApplicationContext';
import { MOCK_CASE } from '../../test/mockCase';
import { ROLES } from '../entities/EntityConstants';
import { sealCaseInteractor } from './sealCaseInteractor';

describe('sealCaseInteractor', () => {
  beforeAll(() => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(MOCK_CASE);
  });

  it('should throw an error if the user is unauthorized to seal a case', async () => {
    await expect(
      sealCaseInteractor(applicationContext, {
        docketNumber: MOCK_CASE.docketNumber,
      }),
    ).rejects.toThrow('Unauthorized for sealing cases');
  });

  it('should call updateCase with the sealedDate set on the case and return the updated case', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.docketClerk,
      userId: 'docketClerk',
    });

    const result = await sealCaseInteractor(applicationContext, {
      docketNumber: MOCK_CASE.docketNumber,
    });
    expect(result.sealedDate).toBeTruthy();
  });

  it('should send a notification that a case has been sealed', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.docketClerk,
      userId: 'docketClerk',
    });

    await sealCaseInteractor(applicationContext, {
      docketNumber: MOCK_CASE.docketNumber,
    });
    expect(
      applicationContext.getDispatchers().sendNotificationOfSealing,
    ).toHaveBeenCalled();
  });
});
