import { saveMinuteSheetToDraftsInteractor } from '@web-client/proxies/trialSessionMinutes/saveMinuteSheetToDraftsProxy';
import { saveMinuteSheetToDraftsAction } from '@web-client/presenter/actions/TrialSessionMinutes/saveMinuteSheetToDraftsAction';
import { runAction } from '@web-client/presenter/test.cerebral';
import { presenter } from '../../presenter-mock';

jest.mock('@web-client/proxies/trialSessionMinutes/saveMinuteSheetToDraftsProxy');

describe('saveMinuteSheetToDraftsAction', () => {
  let mockSaveMinuteSheetToDraftsInteractor: jest.Mock;

  const config = {
    modules: {
      presenter,
    },
    state: {
      caseDetail: { docketNumber: '123-45' },
      trialSession: { trialSessionId: 'trial-session-1' },
    },
  };

  const mockSuccessPath = jest.fn();
  const mockErrorPath = jest.fn();

  presenter.providers.path = {
    error: mockErrorPath,
    success: mockSuccessPath,
  };

  beforeEach(() => {
    mockSaveMinuteSheetToDraftsInteractor =
      saveMinuteSheetToDraftsInteractor as jest.Mock;
  });

  it('should save the minute sheet to drafts successfully and follow path.success', async () => {
    mockSaveMinuteSheetToDraftsInteractor.mockResolvedValue({});

    await runAction(saveMinuteSheetToDraftsAction, config);

    expect(mockSuccessPath).toHaveBeenCalledWith({
      alertSuccess: {
        message: 'Minutes PDF saved to case Drafts.',
      },
    });
  });
  it('should handle errors and follow path.error when saving fails', async () => {
    mockSaveMinuteSheetToDraftsInteractor.mockRejectedValue(new Error());

    await runAction(saveMinuteSheetToDraftsAction, config);

    expect(mockErrorPath).toHaveBeenCalledWith({
      alertError: {
        message: 'Minutes PDF failed to save to case Drafts.',
      },
    });
  });
});
