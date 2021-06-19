import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { batchDownloadTrialSessionAction } from './batchDownloadTrialSessionAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

presenter.providers.applicationContext = applicationContext;

const { batchDownloadTrialSessionInteractor } =
  applicationContext.getUseCases();
const pathSuccessStub = jest.fn();
const pathErrorStub = jest.fn();

presenter.providers.path = {
  error: pathErrorStub,
  success: pathSuccessStub,
};

describe('batchDownloadTrialSessionAction', () => {
  it('initializes the batch download for a trial session', async () => {
    await runAction(batchDownloadTrialSessionAction, {
      modules: {
        presenter,
      },
    });

    expect(batchDownloadTrialSessionInteractor).toHaveBeenCalled();
    expect(pathSuccessStub).toHaveBeenCalled();
  });

  it('calls the error path if an exception is thrown', async () => {
    batchDownloadTrialSessionInteractor.mockImplementation(() => {
      throw new Error('Guy Fieri has connected to the server.');
    }),
      await runAction(batchDownloadTrialSessionAction, {
        modules: {
          presenter,
        },
      });

    expect(batchDownloadTrialSessionInteractor).toThrow();
    expect(pathErrorStub).toHaveBeenCalled();
  });
});
