import { navigateToPrintPaperTrialNoticesAction } from '@web-client/presenter/actions/TrialSession/navigateToPrintPaperTrialNoticesAction';
import { presenter } from '@web-client/presenter/presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('navigateToPrintPaperTrialNoticesAction', () => {
  let routeStub;

  beforeAll(() => {
    routeStub = jest.fn();

    presenter.providers.router = {
      route: routeStub,
    };
  });

  it('should merge case order into associated eligible cases', async () => {
    await runAction(navigateToPrintPaperTrialNoticesAction, {
      modules: {
        presenter,
      },
      props: {
        fileId: 'TEST_FILE_ID',
      },
      state: {
        trialSession: {
          trialSessionId: 'TEST_TRIAL_SESSION_ID',
        },
      },
    });

    const routeCalls = routeStub.mock.calls;
    expect(routeCalls.length).toEqual(1);
    expect(routeCalls[0][0]).toEqual(
      '/trial-session-detail/TEST_TRIAL_SESSION_ID/print-paper-trial-notices/TEST_FILE_ID',
    );
  });
});
