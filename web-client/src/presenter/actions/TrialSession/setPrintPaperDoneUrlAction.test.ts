import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setPrintPaperDoneUrlAction } from './setPrintPaperDoneUrlAction';

describe('setPrintPaperDoneUrlAction', () => {
  it('sets the printPaperDoneUrl to /trial-sessions when trialSessionId is not on props', async () => {
    const result = await runAction(setPrintPaperDoneUrlAction, {
      modules: {
        presenter,
      },
      props: {},
      state: {
        printPaperDoneUrl: null,
      },
    });

    expect(result.state.printPaperDoneUrl).toEqual('/trial-sessions');
  });

  it('sets the printPaperDoneUrl to /trial-session-detail/abc when props.trialSessionId is set to abc', async () => {
    const EXPECTED_TRIAL_SESSION_ID = 'abc';
    const result = await runAction(setPrintPaperDoneUrlAction, {
      modules: {
        presenter,
      },
      props: {
        trialSessionId: EXPECTED_TRIAL_SESSION_ID,
      },
      state: {
        printPaperDoneUrl: null,
      },
    });

    expect(result.state.printPaperDoneUrl).toEqual(
      `/trial-session-detail/${EXPECTED_TRIAL_SESSION_ID}`,
    );
  });
});
