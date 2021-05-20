import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { getNotificationsAction } from './getNotificationsAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

describe('getNotificationsAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
    applicationContext
      .getUseCases()
      .getNotificationsInteractor.mockReturnValue({});
  });

  it('calls the user case for fetching the notifications map', async () => {
    await runAction(getNotificationsAction, {
      modules: {
        presenter,
      },
    });

    expect(
      applicationContext.getUseCases().getNotificationsInteractor,
    ).toHaveBeenCalled();
  });

  it('calls the user case for fetching the notifications map with a judgeUserId if a judgeUser is set on state', async () => {
    await runAction(getNotificationsAction, {
      modules: {
        presenter,
      },
      state: {
        judgeUser: {
          userId: '123',
        },
      },
    });

    expect(
      applicationContext.getUseCases().getNotificationsInteractor.mock
        .calls[0][1].judgeUserId,
    ).toEqual('123');
  });
});
