import { batchDownloadTrialSessionAction } from './batchDownloadTrialSessionAction';
import { presenter } from '../presenter';
import { runAction } from 'cerebral/test';

describe('batchDownloadTrialSessionAction', () => {
  let batchDownloadTrialSessionInteractorStub;
  let pathSuccessStub;
  let pathErrorStub;

  beforeEach(() => {
    batchDownloadTrialSessionInteractorStub = jest.fn();
    pathSuccessStub = jest.fn();
    pathErrorStub = jest.fn();

    presenter.providers.applicationContext = {
      getUseCases: () => ({
        batchDownloadTrialSessionInteractor: batchDownloadTrialSessionInteractorStub,
      }),
    };
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

  it('fails', async () => {});
});
