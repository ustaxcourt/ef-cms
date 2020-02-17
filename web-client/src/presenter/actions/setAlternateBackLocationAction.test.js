import { runAction } from 'cerebral/test';
import { setAlternateBackLocationAction } from './setAlternateBackLocationAction';

describe('setAlternateBackLocationAction', () => {
  it('should set backLocation on screenMetadata if a case is being added to an already calendared trial session', async () => {
    const result = await runAction(setAlternateBackLocationAction, {
      props: {
        caseId: '123',
        isTrialSessionCalendared: true,
      },
      state: {
        screenMetadata: {},
      },
    });

    expect(result.state.screenMetadata.backLocation).toEqual(
      '/case-detail/123',
    );
  });

  it('should NOT set backLocation on screenMetadata when a case is NOT being added to an already calendared trial session', async () => {
    const result = await runAction(setAlternateBackLocationAction, {
      props: {
        caseId: '123',
        isTrialSessionCalendared: false,
      },
      state: {
        screenMetadata: {},
      },
    });

    expect(result.state.screenMetadata.backLocation).toBeFalsy();
  });
});
