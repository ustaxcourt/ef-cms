import { mockMinuteSheetFormState } from './mockMinuteSheetFormState';
import { presenter } from '@web-client/presenter/presenter';
import { runAction } from '@web-client/presenter/test.cerebral';
import { updateMinuteSheetInteractor } from '@shared/proxies/trialSessionMinutes/updateMinuteSheetProxy';
import hash from 'object-hash';
import { autosaveTrialSessionMinuteSheetAction } from '@web-client/presenter/actions/TrialSessionMinutes/autosaveTrialSessionMinuteSheetAction';

jest.mock('@shared/proxies/trialSessionMinutes/updateMinuteSheetProxy');

describe('trialSessionMinutesAutosaveAction', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should not autosave when form has not changed', async () => {
    const mockSnapshot = hash(mockMinuteSheetFormState);

    await runAction(autosaveTrialSessionMinuteSheetAction, {
      modules: {
        presenter,
      },
      props: {},
      state: {
        caseDetail: { docketNumber: '123-45' },
        minuteSheetForm: mockMinuteSheetFormState,
        minuteSheetFormSnapshot: mockSnapshot,
        trialSession: { trialSessionId: 'trial-123' },
      },
    });

    expect(updateMinuteSheetInteractor).not.toHaveBeenCalled();
  });

  it('should autosave when form has changed', async () => {
    const mockUpdateResponse = { updated: true };
    (updateMinuteSheetInteractor as jest.Mock).mockResolvedValue(
      mockUpdateResponse,
    );

    const { state } = await runAction(autosaveTrialSessionMinuteSheetAction, {
      modules: {
        presenter,
      },
      props: {},
      state: {
        caseDetail: { docketNumber: '123-45' },
        minuteSheetForm: mockMinuteSheetFormState,
        minuteSheetFormSnapshot: 'different-hash',
        trialSession: { trialSessionId: 'trial-123' },
      },
    });

    expect(updateMinuteSheetInteractor).toHaveBeenCalledWith({
      docketNumber: '123-45',
      minuteSheet: mockMinuteSheetFormState,
      trialSessionId: 'trial-123',
    });
    expect(state.minuteSheetFormSnapshot).toBe(mockUpdateResponse);
  });

  it('should autosave when forceAutosave is true regardless of changes', async () => {
    const mockSnapshot = '123abc';
    const mockUpdateResponse = { updated: true };
    (updateMinuteSheetInteractor as jest.Mock).mockResolvedValue(
      mockUpdateResponse,
    );

    const { state } = await runAction(autosaveTrialSessionMinuteSheetAction, {
      modules: {
        presenter,
      },
      props: {
        forceAutosave: true,
      },
      state: {
        caseDetail: { docketNumber: '123-45' },
        minuteSheetForm: mockMinuteSheetFormState,
        minuteSheetFormSnapshot: mockSnapshot,
        trialSession: { trialSessionId: 'trial-123' },
      },
    });

    expect(updateMinuteSheetInteractor).toHaveBeenCalledWith({
      docketNumber: '123-45',
      minuteSheet: mockMinuteSheetFormState,
      trialSessionId: 'trial-123',
    });
    expect(state.minuteSheetFormSnapshot).toBe(mockUpdateResponse);
  });
});
