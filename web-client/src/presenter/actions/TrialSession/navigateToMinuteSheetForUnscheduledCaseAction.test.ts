import { navigateToMinuteSheetForUnscheduledCaseAction } from './navigateToMinuteSheetForUnscheduledCaseAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('navigateToMinuteSheetForUnscheduledCaseAction', () => {
  beforeAll(() => {
    window.open = jest.fn();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should open minute sheet in a new tab for unscheduled case', async () => {
    await runAction(navigateToMinuteSheetForUnscheduledCaseAction, {
      state: {
        modal: {
          caseInfo: {
            docketNumber: '123-45',
          },
          trialSessionId: 'trial-session-123',
        },
      },
    });

    expect(window.open).toHaveBeenCalledWith(
      '/trial-session-detail/trial-session-123/case/123-45/minutes?isUnscheduledCase=true',
      '_blank',
    );
  });

  it('should use lead docket number for consolidated cases', async () => {
    await runAction(navigateToMinuteSheetForUnscheduledCaseAction, {
      state: {
        modal: {
          caseInfo: {
            docketNumber: '123-45',
            leadDocketNumber: '100-45',
          },
          trialSessionId: 'trial-session-456',
        },
      },
    });

    expect(window.open).toHaveBeenCalledWith(
      '/trial-session-detail/trial-session-456/case/100-45/minutes?isUnscheduledCase=true',
      '_blank',
    );
  });
});
