import { runAction } from '@web-client/presenter/test.cerebral';
import { setMessageCountsAction } from './setMessageCountsAction';

describe('setMessageCountsAction', () => {
  it('sets the user inbox message count from notifications', async () => {
    const result = await runAction(setMessageCountsAction, {
      props: {
        notifications: {
          userInboxCount: 5,
          userSectionCount: 4,
        },
      },
    });

    expect(result.state.messagesInboxCount).toEqual(5);
    expect(result.state.messagesSectionCount).toEqual(4);
  });

  it('sets the user inbox message count to 0 if nothing was provided', async () => {
    const result = await runAction(setMessageCountsAction, {
      props: {},
    });

    expect(result.state.messagesInboxCount).toEqual(0);
    expect(result.state.messagesSectionCount).toEqual(0);
  });
});
