import { MOCK_CASE } from '@shared/test/mockCase';
import { checkForExistingMinuteSheetAction } from './checkForExistingMinuteSheetAction';
import { getMinuteSheetInteractor } from '@shared/proxies/trialSessionMinutes/getMinuteSheetProxy';
import { presenter } from '@web-client/presenter/presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

jest.mock('@shared/proxies/trialSessionMinutes/getMinuteSheetProxy');

describe('checkForExistingMinuteSheetAction', () => {
  const mockYesPath = jest.fn();
  const mockNoPath = jest.fn();
  presenter.providers.path = {
    no: mockNoPath,
    yes: mockYesPath,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return path.yes with minuteSheet when a minute sheet exists', async () => {
    const mockMinuteSheet = {
      docketNumber: '123-45',
      trialSessionId: 'trial-session-id-123',
    };

    (getMinuteSheetInteractor as jest.Mock).mockResolvedValue(mockMinuteSheet);

    await runAction(checkForExistingMinuteSheetAction, {
      modules: {
        presenter,
      },
      props: {
        caseDetail: MOCK_CASE,
        trialSession: {
          trialSessionId: 'trial-session-id-123',
        },
      },
      state: {},
    });

    expect(getMinuteSheetInteractor).toHaveBeenCalledWith({
      docketNumber: MOCK_CASE.docketNumber,
      trialSessionId: 'trial-session-id-123',
    });
    expect(mockYesPath).toHaveBeenCalledWith({ minuteSheet: mockMinuteSheet });
  });

  it('should return path.no when no minute sheet exists', async () => {
    (getMinuteSheetInteractor as jest.Mock).mockResolvedValue(null);

    await runAction(checkForExistingMinuteSheetAction, {
      modules: {
        presenter,
      },
      props: {
        caseDetail: MOCK_CASE,
        trialSession: {
          trialSessionId: 'trial-session-id-123',
        },
      },
      state: {},
    });

    expect(getMinuteSheetInteractor).toHaveBeenCalledWith({
      docketNumber: MOCK_CASE.docketNumber,
      trialSessionId: 'trial-session-id-123',
    });
    expect(mockNoPath).toHaveBeenCalled();
  });
});
