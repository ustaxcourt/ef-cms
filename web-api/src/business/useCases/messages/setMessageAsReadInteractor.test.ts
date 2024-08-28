import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import {
  mockPetitionerUser,
  mockPetitionsClerkUser,
} from '@shared/test/mockAuthUsers';
import { setMessageAsReadInteractor } from './setMessageAsReadInteractor';

describe('setMessageAsReadInteractor', () => {
  it('returns an authorization error if the user does not have the necessary permission', async () => {
    await expect(
      setMessageAsReadInteractor(
        applicationContext,
        {
          docketNumber: '123-45',
          messageId: '123',
        },
        mockPetitionerUser,
      ),
    ).rejects.toThrow('Unauthorized');
    expect(
      applicationContext.getPersistenceGateway().setMessageAsRead,
    ).not.toHaveBeenCalled();
  });

  it('calls the persistence method for marking a message as read for the given messageId', async () => {
    await setMessageAsReadInteractor(
      applicationContext,
      {
        docketNumber: '123-45',
        messageId: '123',
      },
      mockPetitionsClerkUser,
    );

    expect(
      applicationContext.getPersistenceGateway().setMessageAsRead,
    ).toHaveBeenCalledWith({
      applicationContext,
      docketNumber: '123-45',
      messageId: '123',
    });
  });
});
