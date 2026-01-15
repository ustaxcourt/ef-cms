import { MOCK_CASE } from '@shared/test/mockCase';
import {
  caseIsEligibleForMinuteSheet,
  isEligibleUnscheduledCaseForMinuteSheet,
} from '@shared/business/utilities/trialSessionMinutes/caseIsEligibleForMinuteSheet';
import { isEligibleForMinuteSheetAction } from './isEligibleForMinuteSheetAction';
import { presenter } from '@web-client/presenter/presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

jest.mock(
  '@shared/business/utilities/trialSessionMinutes/caseIsEligibleForMinuteSheet',
);

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

  describe('scheduled cases (case in caseOrder)', () => {
    it('should return path.yes and set isUnscheduledMinuteSheet to false when case is eligible for minute sheet', async () => {
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

      const { state } = await runAction(isEligibleForMinuteSheetAction, {
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
      expect(state.isUnscheduledMinuteSheet).toBe(false);
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

  describe('unscheduled cases (case NOT in caseOrder)', () => {
    it('should return path.yes and set isUnscheduledMinuteSheet to true when unscheduled case is eligible', async () => {
      (isEligibleUnscheduledCaseForMinuteSheet as jest.Mock).mockReturnValue(
        true,
      );

      const mockTrialSession = {
        caseOrder: [], // Case not in caseOrder
        trialSessionId: 'trial-session-id-123',
      };

      const { state } = await runAction(isEligibleForMinuteSheetAction, {
        modules: {
          presenter,
        },
        state: {
          caseDetail: MOCK_CASE,
          trialSession: mockTrialSession,
        },
      });

      expect(isEligibleUnscheduledCaseForMinuteSheet).toHaveBeenCalledWith(
        MOCK_CASE,
        mockTrialSession,
      );
      expect(caseIsEligibleForMinuteSheet).not.toHaveBeenCalled();
      expect(mockYesPath).toHaveBeenCalled();
      expect(mockNoPath).not.toHaveBeenCalled();
      expect(state.isUnscheduledMinuteSheet).toBe(true);
    });

    it('should return path.no when unscheduled case is not eligible', async () => {
      (isEligibleUnscheduledCaseForMinuteSheet as jest.Mock).mockReturnValue(
        false,
      );

      const mockTrialSession = {
        caseOrder: [], // Case not in caseOrder
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

      expect(isEligibleUnscheduledCaseForMinuteSheet).toHaveBeenCalledWith(
        MOCK_CASE,
        mockTrialSession,
      );
      expect(caseIsEligibleForMinuteSheet).not.toHaveBeenCalled();
      expect(mockNoPath).toHaveBeenCalled();
      expect(mockYesPath).not.toHaveBeenCalled();
    });

    it('should check for unscheduled eligibility when caseOrder is undefined', async () => {
      (isEligibleUnscheduledCaseForMinuteSheet as jest.Mock).mockReturnValue(
        true,
      );

      const mockTrialSession = {
        caseOrder: undefined, // caseOrder is undefined
        trialSessionId: 'trial-session-id-123',
      };

      const { state } = await runAction(isEligibleForMinuteSheetAction, {
        modules: {
          presenter,
        },
        state: {
          caseDetail: MOCK_CASE,
          trialSession: mockTrialSession,
        },
      });

      expect(isEligibleUnscheduledCaseForMinuteSheet).toHaveBeenCalledWith(
        MOCK_CASE,
        mockTrialSession,
      );
      expect(mockYesPath).toHaveBeenCalled();
      expect(state.isUnscheduledMinuteSheet).toBe(true);
    });
  });
});
