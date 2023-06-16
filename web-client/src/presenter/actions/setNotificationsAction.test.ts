import { runAction } from '@web-client/presenter/test.cerebral';
import { setNotificationsAction } from './setNotificationsAction';

describe('setNotificationsAction', () => {
  const mockNotifications = [{ messageId: '123', subject: 'hello' }];

  it('sets the state.notifications to the value of props.notifications', async () => {
    const { state } = await runAction(setNotificationsAction, {
      props: {
        notifications: mockNotifications,
      },
      state: {},
    });
    expect(state.notifications).toEqual(mockNotifications);
  });
});
