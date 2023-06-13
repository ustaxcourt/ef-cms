import { runAction } from '@web-client/presenter/test.cerebral';
import { setCalendaredCasesOnTrialSessionAction } from './setCalendaredCasesOnTrialSessionAction';

describe('setCalendaredCasesOnTrialSessionAction', () => {
  it('sets calendared cases on trial session', async () => {
    const result = await runAction(setCalendaredCasesOnTrialSessionAction, {
      props: {
        calendaredCases: [{ docketNumber: '123-45' }],
      },
    });

    expect(result.state.trialSession.calendaredCases).toMatchObject([
      { docketNumber: '123-45' },
    ]);
  });
});
