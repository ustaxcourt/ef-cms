import { batchDownloadTrialSessionAction } from './batchDownloadTrialSessionAction';
import { presenter } from '../presenter';
import { runAction } from 'cerebral/test';

const batchDownloadTrialSessionInteractorStub = jest.fn();
const pathSuccessStub = jest.fn();
const pathErrorStub = jest.fn();

presenter.providers.path = {
  error: pathErrorStub,
  success: pathSuccessStub,
};

presenter.providers.applicationContext = {
  getUseCases: () => ({
    batchDownloadTrialSessionInteractor: batchDownloadTrialSessionInteractorStub,
  }),
};

describe('batchDownloadTrialSessionAction', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('initializes the batch download for a trial session', async () => {
    await runAction(batchDownloadTrialSessionAction, {
      modules: {
        presenter,
      },
    });

    expect(batchDownloadTrialSessionInteractorStub).toHaveBeenCalled();
    expect(pathSuccessStub).toHaveBeenCalled();
  });

  it('calls the error path if an exception is thrown', async () => {
    presenter.providers.applicationContext = {
      getUseCases: () => ({
        batchDownloadTrialSessionInteractor: batchDownloadTrialSessionInteractorStub.mockImplementation(
          () => {
            throw new Error('Guy Fieri has connected to the server.');
          },
        ),
      }),
    };
    await runAction(batchDownloadTrialSessionAction, {
      modules: {
        presenter,
      },
    });

    expect(batchDownloadTrialSessionInteractorStub).toThrow();
    expect(pathErrorStub).toHaveBeenCalled();
  });
});
