import { navigateToMinuteSheetForUnscheduledCaseAction } from './navigateToMinuteSheetForUnscheduledCaseAction';
import { presenter } from '@web-client/presenter/presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('navigateToMinuteSheetForUnscheduledCaseAction', () => {
  let routeStub: jest.Mock;
  let openStub: jest.Mock;

  beforeAll(() => {
    routeStub = jest.fn();
    openStub = jest.fn();
    presenter.providers.router = {
      route: routeStub,
    };
    window.open = openStub;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('should open minute sheet in a new tab for unscheduled case', async () => {
    await runAction(navigateToMinuteSheetForUnscheduledCaseAction, {
      modules: {
        presenter,
      },
      state: {
        modal: {
          caseInfo: {
            docketNumber: '123-45',
          },
          trialSessionId: 'trial-session-123',
        },
      },
    });

    expect(openStub).toHaveBeenCalledWith(
      '/trial-session-detail/trial-session-123/case/123-45/minutes?isUnscheduledCase=true',
      '_blank',
    );
    expect(routeStub).not.toHaveBeenCalled();
  });

  it('should use lead docket number for consolidated cases', async () => {
    await runAction(navigateToMinuteSheetForUnscheduledCaseAction, {
      modules: {
        presenter,
      },
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

    expect(openStub).toHaveBeenCalledWith(
      '/trial-session-detail/trial-session-456/case/100-45/minutes?isUnscheduledCase=true',
      '_blank',
    );
    expect(routeStub).not.toHaveBeenCalled();
  });

  it('should use router.route instead of window.open when Cypress flag is set', async () => {
    localStorage.setItem('__cypressMinuteSheetInSameTab', 'true');

    await runAction(navigateToMinuteSheetForUnscheduledCaseAction, {
      modules: {
        presenter,
      },
      state: {
        modal: {
          caseInfo: {
            docketNumber: '123-45',
          },
          trialSessionId: 'trial-session-123',
        },
      },
    });

    expect(routeStub).toHaveBeenCalledWith(
      '/trial-session-detail/trial-session-123/case/123-45/minutes?isUnscheduledCase=true',
    );
    expect(openStub).not.toHaveBeenCalled();
  });
});
