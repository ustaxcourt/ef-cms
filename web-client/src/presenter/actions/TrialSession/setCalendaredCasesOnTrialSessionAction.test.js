import { runAction } from 'cerebral/test';
import { setCalendaredCasesOnTrialSessionAction } from './setCalendaredCasesOnTrialSessionAction';

describe('setCalendaredCasesOnTrialSessionAction', () => {
  it('sets calendared cases on trial session', async () => {
    const result = await runAction(setCalendaredCasesOnTrialSessionAction, {
      props: {
        calendaredCases: [{ caseId: 'case-id-123' }],
      },
    });

    expect(result.state.trialSession.calendaredCases).toMatchObject([
      { caseId: 'case-id-123' },
    ]);
  });
});
