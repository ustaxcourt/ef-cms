import { ROLES } from '../../../../../shared/src/business/entities/EntityConstants';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { setMessageAsReadInteractor } from './setMessageAsReadInteractor';

describe('setMessageAsReadInteractor', () => {
  it('returns an authorization error if the user does not have the necessary permission', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.petitioner,
      userId: 'petitioner',
    });

    await expect(
      setMessageAsReadInteractor(applicationContext, {
        docketNumber: '123-45',
        messageId: '123',
      }),
    ).rejects.toThrow('Unauthorized');
    expect(
      applicationContext.getPersistenceGateway().setMessageAsRead,
    ).not.toHaveBeenCalled();
  });

  it('calls the persistence method for marking a message as read for the given messageId', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.petitionsClerk,
      userId: 'petitionsClerk',
    });

    await setMessageAsReadInteractor(applicationContext, {
      docketNumber: '123-45',
      messageId: '123',
    });

    expect(
      applicationContext.getPersistenceGateway().setMessageAsRead,
    ).toHaveBeenCalledWith({
      applicationContext,
      docketNumber: '123-45',
      messageId: '123',
    });
  });
});
