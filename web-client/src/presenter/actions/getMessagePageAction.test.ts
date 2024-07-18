import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { getMessagePageAction } from '@web-client/presenter/actions/getMessagePageAction';
import { presenter } from '@web-client/presenter/presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('getMessagePageAction', () => {
  const pathDetailMock = jest.fn();
  const pathInboxMock = jest.fn();
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
    presenter.providers.path = {
      detail: pathDetailMock,
      inbox: pathInboxMock,
    };
  });

  it('should return path.detail when currentPage is "MessageDetail"', async () => {
    await runAction(getMessagePageAction, {
      modules: {
        presenter,
      },
      state: {
        currentPage: 'MessageDetail',
      },
    });

    expect(pathDetailMock).toHaveBeenCalled();
    expect(pathInboxMock).not.toHaveBeenCalled();
  });

  it('should return path.inbox when currentPage is not "MessageDetail"', async () => {
    await runAction(getMessagePageAction, {
      modules: {
        presenter,
      },
      state: {
        currentPage: 'Inbox',
      },
    });

    expect(pathInboxMock).toHaveBeenCalled();
    expect(pathDetailMock).not.toHaveBeenCalled();
  });

  it('should return path.inbox when currentPage is undefined', async () => {
    await runAction(getMessagePageAction, {
      modules: {
        presenter,
      },
      state: {
        currentPage: 'Inbox',
      },
    });

    expect(pathInboxMock).toHaveBeenCalled();
    expect(pathDetailMock).not.toHaveBeenCalled();
  });
});
