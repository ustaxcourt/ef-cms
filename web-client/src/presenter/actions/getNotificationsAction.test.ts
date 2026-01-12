import { DOCKET_SECTION } from '../../../../shared/src/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { getNotificationsAction } from './getNotificationsAction';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('getNotificationsAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
    applicationContext
      .getUseCases()
      .getNotificationsInteractor.mockReturnValue({});
  });

  it('makes a call to fetch notifications', async () => {
    await runAction(getNotificationsAction, {
      modules: {
        presenter,
      },
      state: {
        user: { section: DOCKET_SECTION },
      },
    });

    expect(
      applicationContext.getUseCases().getNotificationsInteractor,
    ).toHaveBeenCalled();
  });

  it('makes a call to fetch notifications with a judgeUserId when state.judgeUser is defined', async () => {
    const judgeId = '123456';
    await runAction(getNotificationsAction, {
      modules: {
        presenter,
      },
      state: {
        judgeUser: {
          userId: judgeId,
        },
        user: {
          section: DOCKET_SECTION,
        },
      },
    });

    expect(
      applicationContext.getUseCases().getNotificationsInteractor.mock
        .calls[0][1].judgeId,
    ).toEqual(judgeId);
  });

  it('makes a call to fetch notifications with case services supervisor information when state.workQueueToDisplay.section is defined', async () => {
    const userId = 'this is a user id';
    const section = 'section';
    await runAction(getNotificationsAction, {
      modules: {
        presenter,
      },
      state: {
        user: { userId, section },
        workQueueToDisplay: {
          section: DOCKET_SECTION,
        },
      },
    });

    expect(
      applicationContext.getUseCases().getNotificationsInteractor.mock
        .calls[0][1],
    ).toEqual({
      section,
      selectedSection: DOCKET_SECTION,
    });
  });

  it('should throw an error if the logged-in user does not have a section', async () => {
    await expect(
      runAction(getNotificationsAction, {
        modules: {
          presenter,
        },
        state: {
          user: { userId: '123' },
        },
      }),
    ).rejects.toThrow('Unable to fetch work items without a section');
  });
});
