import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { batchDownloadTrialSessionAction } from './batchDownloadTrialSessionAction';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('batchDownloadTrialSessionAction', () => {
  const pathSuccessStub = jest.fn();
  const pathErrorStub = jest.fn();

  const mockTrialSessionId = '6d3a06cc-17d7-4699-be4d-6bf93c0317e9';

  presenter.providers.applicationContext = applicationContext;

  presenter.providers.path = {
    error: pathErrorStub,
    success: pathSuccessStub,
  };

  it('should make a call to persistence to batch download cases for the specified trial session', async () => {
    await runAction(batchDownloadTrialSessionAction, {
      modules: {
        presenter,
      },
      state: {
        trialSession: { trialSessionId: mockTrialSessionId },
      },
    });

    expect(
      applicationContext.getUseCases().batchDownloadTrialSessionInteractor.mock
        .calls[0][1].trialSessionId,
    ).toBe(mockTrialSessionId);
    expect(pathSuccessStub).toHaveBeenCalled();
  });

  it('should call the error path to open a modal when an error occurs when downloading trial session data', async () => {
    applicationContext
      .getUseCases()
      .batchDownloadTrialSessionInteractor.mockImplementation(() => {
        throw new Error('Guy Fieri has connected to the server.');
      });

    await runAction(batchDownloadTrialSessionAction, {
      modules: {
        presenter,
      },
      state: {
        trialSession: { trialSessionId: mockTrialSessionId },
      },
    });

    expect(
      applicationContext.getUseCases().batchDownloadTrialSessionInteractor,
    ).toThrow();
    expect(pathErrorStub).toHaveBeenCalledWith({
      showModal: 'FileCompressionErrorModal',
    });
  });
});
