import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { getShouldMarkMessageAsReadAction } from './getShouldMarkMessageAsReadAction';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

const markReadStub = jest.fn();
const noActionStub = jest.fn();

presenter.providers.path = {
  markRead: markReadStub,
  noAction: noActionStub,
};

describe('getShouldMarkMessageAsReadAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('should return the markRead path if the message is unread and belongs to the current user', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      userId: '123',
    });

    await runAction(getShouldMarkMessageAsReadAction, {
      modules: {
        presenter,
      },
      props: {
        mostRecentMessage: {
          isRead: false,
          toUserId: '123',
        },
      },
    });

    expect(markReadStub.mock.calls.length).toEqual(1);
    expect(markReadStub).toHaveBeenCalledWith({
      messageToMarkRead: {
        isRead: false,
        toUserId: '123',
      },
    });
  });

  it('should return the noAction path the message is already read', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      userId: '123',
    });

    await runAction(getShouldMarkMessageAsReadAction, {
      modules: {
        presenter,
      },
      props: {
        mostRecentMessage: {
          isRead: true,
          toUserId: '123',
        },
      },
    });

    expect(noActionStub.mock.calls.length).toEqual(1);
  });

  it('should return the noAction path the message is not assigned to the current user', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      userId: '123',
    });

    await runAction(getShouldMarkMessageAsReadAction, {
      modules: {
        presenter,
      },
      props: {
        mostRecentMessage: {
          isRead: false,
          toUserId: '321',
        },
      },
    });

    expect(noActionStub.mock.calls.length).toEqual(1);
  });
});
