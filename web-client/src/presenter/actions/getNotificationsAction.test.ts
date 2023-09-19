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
    });

    expect(
      applicationContext.getUseCases().getNotificationsInteractor,
    ).toHaveBeenCalled();
  });

  it('makes a call to fetch notifications with a judgeUserId when state.judgeUser is defined', async () => {
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

  it('makes a call to fetch notifications with case services supervisor information when state.messageBoxToDisplay.section is defined', async () => {
    await runAction(getNotificationsAction, {
      modules: {
        presenter,
      },
      state: {
        messageBoxToDisplay: {
          section: DOCKET_SECTION,
        },
      },
    });

    expect(
      applicationContext.getUseCases().getNotificationsInteractor.mock
        .calls[0][1].caseServicesSupervisorData,
    ).toEqual({
      section: DOCKET_SECTION,
      userId: 'a805d1ab-18d0-43ec-bafb-654e83405416',
    });
  });

  it('makes a call to fetch notifications with case services supervisor information when state.workQueueToDisplay.section is defined', async () => {
    await runAction(getNotificationsAction, {
      modules: {
        presenter,
      },
      state: {
        workQueueToDisplay: {
          section: DOCKET_SECTION,
        },
      },
    });

    expect(
      applicationContext.getUseCases().getNotificationsInteractor.mock
        .calls[0][1].caseServicesSupervisorData,
    ).toEqual({
      section: DOCKET_SECTION,
      userId: 'a805d1ab-18d0-43ec-bafb-654e83405416',
    });
  });
});
