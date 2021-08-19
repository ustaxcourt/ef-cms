import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';
import { setMessageAsReadAction } from './setMessageAsReadAction';

describe('setMessageAsReadAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('should set message as read', async () => {
    const result = await runAction(setMessageAsReadAction, {
      modules: { presenter },
      props: {
        messageToMarkRead: {
          docketNumber: '123-45',
          messageId: '123',
        },
      },
      state: {
        notifications: {
          unreadMessageCount: 1,
        },
      },
    });

    expect(
      applicationContext.getUseCases().setMessageAsReadInteractor.mock
        .calls[0][1],
    ).toMatchObject({
      docketNumber: '123-45',
      messageId: '123',
    });
    expect(result.state.notifications.unreadMessageCount).toBe(0);
  });
});
