import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';
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
    const result = await runAction(setPrintPaperDoneUrlAction, {
      modules: {
        presenter,
      },
      props: {
        trialSessionId: 'abc',
      },
      state: {
        printPaperDoneUrl: null,
      },
    });

    expect(result.state.printPaperDoneUrl).toEqual('/trial-session-detail/abc');
  });
});
