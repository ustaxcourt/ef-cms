import { batchDownloadTrialSessionAction } from './batchDownloadTrialSessionAction';
import { presenter } from '../presenter';
import { runAction } from 'cerebral/test';

import { applicationContextForClient } from '../../../../shared/src/business/test/createTestApplicationContext';
const applicationContext = applicationContextForClient;
presenter.providers.applicationContext = applicationContext;

const batchDownloadTrialSessionInteractor = applicationContext.getUseCases()
  .batchDownloadTrialSessionInteractor;
const pathSuccessStub = jest.fn();
const pathErrorStub = jest.fn();

presenter.providers.path = {
  error: pathErrorStub,
  success: pathSuccessStub,
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
