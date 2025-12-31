import { runAction } from '@web-client/presenter/test.cerebral';
import { openNewMinuteSheetModalAction } from './openNewMinuteSheetModalAction';

describe('openNewMinuteSheetModalAction', () => {
  it('should set trialSessionId from state.trialSession.trialSessionId', async () => {
    const mockTrialSessionId = 'trial-session-123';

    const result = await runAction(openNewMinuteSheetModalAction, {
      state: {
        modal: {},
        trialSession: {
          trialSessionId: mockTrialSessionId,
        },
      },
    });

    expect(result.state.modal.trialSessionId).toBe(mockTrialSessionId);
  });

  it('should clear modal.form when opening the modal', async () => {
    const result = await runAction(openNewMinuteSheetModalAction, {
      state: {
        modal: {
          form: {
            docketNumber: 'existing-value',
          },
        },
        trialSession: {
          trialSessionId: 'trial-session-123',
        },
      },
    });

    expect(result.state.modal.form).toBeUndefined();
  });

  it('should clear modal.caseInfo when opening the modal', async () => {
    const result = await runAction(openNewMinuteSheetModalAction, {
      state: {
        modal: {
          caseInfo: {
            caseCaption: 'Existing Case',
            docketNumber: '101-20',
          },
        },
        trialSession: {
          trialSessionId: 'trial-session-123',
        },
      },
    });

    expect(result.state.modal.caseInfo).toBeUndefined();
  });

  it('should clear both form and caseInfo while setting trialSessionId', async () => {
    const mockTrialSessionId = 'new-trial-session-456';

    const result = await runAction(openNewMinuteSheetModalAction, {
      state: {
        modal: {
          caseInfo: {
            caseCaption: 'Previous Case',
            docketNumber: '100-19',
          },
          form: {
            docketNumber: '100-19',
          },
        },
        trialSession: {
          trialSessionId: mockTrialSessionId,
        },
      },
    });

    expect(result.state.modal).toEqual({
      trialSessionId: mockTrialSessionId,
    });
  });

  it('should handle undefined trialSessionId in state', async () => {
    const result = await runAction(openNewMinuteSheetModalAction, {
      state: {
        modal: {},
        trialSession: {},
      },
    });

    expect(result.state.modal.trialSessionId).toBeUndefined();
    expect(result.state.modal.form).toBeUndefined();
    expect(result.state.modal.caseInfo).toBeUndefined();
  });
});
