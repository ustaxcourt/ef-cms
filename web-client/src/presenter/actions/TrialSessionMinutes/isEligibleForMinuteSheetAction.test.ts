import { MOCK_CASE } from '@shared/test/mockCase';
import { caseIsEligibleForMinuteSheet } from '@shared/business/utilities/trialSessionMinutes/caseIsEligibleForMinuteSheet';
import { isEligibleForMinuteSheetAction } from './isEligibleForMinuteSheetAction';
import { presenter } from '@web-client/presenter/presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

jest.mock('@shared/business/utilities/trialSessionMinutes/caseIsEligibleForMinuteSheet');

describe('isEligibleForMinuteSheetAction', () => {
  const mockYesPath = jest.fn();
  const mockNoPath = jest.fn();
  presenter.providers.path = {
    no: mockNoPath,
    yes: mockYesPath,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return path.yes when case is eligible for minute sheet', async () => {
    (caseIsEligibleForMinuteSheet as jest.Mock).mockReturnValue(true);

    const mockTrialSession = {
      caseOrder: [
        {
          docketNumber: MOCK_CASE.docketNumber,
          someOtherProperty: 'value',
        },
      ],
      trialSessionId: 'trial-session-id-123',
    };

    await runAction(isEligibleForMinuteSheetAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: MOCK_CASE,
        trialSession: mockTrialSession,
      },
    });

    expect(caseIsEligibleForMinuteSheet).toHaveBeenCalledWith(
      expect.objectContaining({
        docketNumber: MOCK_CASE.docketNumber,
        someOtherProperty: 'value',
      }),
      mockTrialSession,
    );
    expect(mockYesPath).toHaveBeenCalled();
    expect(mockNoPath).not.toHaveBeenCalled();
  });

  it('should return path.no when case is not eligible for minute sheet', async () => {
    (caseIsEligibleForMinuteSheet as jest.Mock).mockReturnValue(false);

    const mockTrialSession = {
      caseOrder: [
        {
          docketNumber: MOCK_CASE.docketNumber,
          someOtherProperty: 'value',
        },
      ],
      trialSessionId: 'trial-session-id-123',
    };

    await runAction(isEligibleForMinuteSheetAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: MOCK_CASE,
        trialSession: mockTrialSession,
      },
    });

    expect(caseIsEligibleForMinuteSheet).toHaveBeenCalledWith(
      expect.objectContaining({
        docketNumber: MOCK_CASE.docketNumber,
        someOtherProperty: 'value',
      }),
      mockTrialSession,
    );
    expect(mockNoPath).toHaveBeenCalled();
    expect(mockYesPath).not.toHaveBeenCalled();
  });
});
