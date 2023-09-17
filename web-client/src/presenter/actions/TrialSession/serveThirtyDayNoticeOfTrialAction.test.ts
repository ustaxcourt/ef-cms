import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { serveThirtyDayNoticeOfTrialAction } from './serveThirtyDayNoticeOfTrialAction';

describe('serveThirtyDayNoticeOfTrialAction', () => {
  presenter.providers.applicationContext = applicationContext;

  it('should serve thirty day notice of trial documents for the trial session on state', async () => {
    const mockTrialSessionId = '5cab791f-a171-4c54-b5da-dc51b3a67a5c';

    await runAction(serveThirtyDayNoticeOfTrialAction, {
      modules: {
        presenter,
      },
      state: {
        trialSession: {
          trialSessionId: mockTrialSessionId,
        },
      },
    });

    expect(
      applicationContext.getUseCases().serveThirtyDayNoticeInteractor,
    ).toHaveBeenCalledWith(expect.anything(), {
      trialSessionId: mockTrialSessionId,
    });
  });
});
