import '@web-api/persistence/postgres/messages/mocks.jest';
import {
  mockPetitionerUser,
  mockPetitionsClerkUser,
} from '@shared/test/mockAuthUsers';
import { setMessageAsRead } from '@web-api/persistence/postgres/messages/setMessageAsRead';
import { setMessageAsReadInteractor } from './setMessageAsReadInteractor';

describe('setMessageAsReadInteractor', () => {
  it('returns an authorization error if the user does not have the necessary permission', async () => {
    await expect(
      setMessageAsReadInteractor(
        {
          messageId: '123',
        },
        mockPetitionerUser,
      ),
    ).rejects.toThrow('Unauthorized');
    expect(setMessageAsRead).not.toHaveBeenCalled();
  });

  it('calls the persistence method for marking a message as read for the given messageId', async () => {
    await setMessageAsReadInteractor(
      {
        messageId: '123',
      },
      mockPetitionsClerkUser,
    );

    expect(setMessageAsRead).toHaveBeenCalledWith({
      messageId: '123',
    });
  });
});
