import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { openNewMinuteSheetModalAction } from './openNewMinuteSheetModalAction';
import { presenter } from '@web-client/presenter/presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('openNewMinuteSheetModalAction', () => {
  const mockUnscheduledMinuteSheets = [
    {
      caseCaption: 'Test Case 1',
      docketNumber: '101-20',
      docketNumberWithSuffix: '101-20S',
    },
  ];

  beforeEach(() => {
    applicationContext
      .getUseCases()
      .getUnscheduledMinuteSheetsInteractor.mockResolvedValue(
        mockUnscheduledMinuteSheets,
      );
    presenter.providers.applicationContext = applicationContext;
  });

  it('should set trialSessionId from state.trialSession.trialSessionId', async () => {
    const mockTrialSessionId = 'trial-session-123';

    const result = await runAction(openNewMinuteSheetModalAction, {
      modules: { presenter },
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
      modules: { presenter },
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
      modules: { presenter },
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

  it('should fetch and set unscheduled minute sheets', async () => {
    const mockTrialSessionId = 'trial-session-123';

    const result = await runAction(openNewMinuteSheetModalAction, {
      modules: { presenter },
      state: {
        modal: {},
        trialSession: {
          trialSessionId: mockTrialSessionId,
        },
      },
    });

    expect(
      applicationContext.getUseCases().getUnscheduledMinuteSheetsInteractor,
    ).toHaveBeenCalledWith({
      trialSessionId: mockTrialSessionId,
    });
    expect(result.state.modal.editUnscheduledMinutesList).toEqual(
      mockUnscheduledMinuteSheets,
    );
  });

  it('should set empty list if fetching unscheduled minute sheets fails', async () => {
    applicationContext
      .getUseCases()
      .getUnscheduledMinuteSheetsInteractor.mockRejectedValue(
        new Error('Network error'),
      );

    const result = await runAction(openNewMinuteSheetModalAction, {
      modules: { presenter },
      state: {
        modal: {},
        trialSession: {
          trialSessionId: 'trial-session-123',
        },
      },
    });

    expect(result.state.modal.editUnscheduledMinutesList).toEqual([]);
  });

  it('should handle undefined trialSessionId in state', async () => {
    const result = await runAction(openNewMinuteSheetModalAction, {
      modules: { presenter },
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
