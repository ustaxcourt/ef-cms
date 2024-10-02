import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setMessageAsReadAction } from './setMessageAsReadAction';

describe('setMessageAsReadAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('should set message as read and update unreadMessageCount in state', async () => {
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
      messageId: '123',
    });
    expect(result.state.notifications.unreadMessageCount).toBe(0);
  });

  it('should not update unreadMessageCount if there are no unread messages', async () => {
    const result = await runAction(setMessageAsReadAction, {
      modules: { presenter },
      props: {
        messageToMarkRead: {
          docketNumber: '123-45',
          messageId: '123',
        },
      },
      state: {
        notifications: {},
      },
    });

    expect(
      applicationContext.getUseCases().setMessageAsReadInteractor.mock
        .calls[0][1],
    ).toMatchObject({
      messageId: '123',
    });
    expect(result.state.notifications.unreadMessageCount).toBe(undefined);
  });
});
