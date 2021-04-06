import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';
import { verifyPdfsAction } from './verifyPdfsAction';

describe('verifyPdfsAction', () => {
  let successStub;
  let errorStub;

  beforeAll(() => {
    successStub = jest.fn();
    errorStub = jest.fn();

    presenter.providers.applicationContext = applicationContext;
    presenter.providers.path = {
      error: errorStub,
      success: successStub,
    };
  });

  it("should return the error path when one of the uploaded PDFs can't be verified", async () => {
    applicationContext
      .getUseCases()
      .verifyPdfsInteractor.mockRejectedValue(null);

    await runAction(verifyPdfsAction, {
      modules: {
        presenter,
      },
    });

    expect(errorStub).toHaveBeenCalledWith({
      alertError: {
        title: 'ERROR',
      },
    });
  });

  it('should return the success path when all of the uploaded PDFs have been verified successfully', async () => {
    applicationContext
      .getUseCases()
      .verifyPdfsInteractor.mockResolvedValue(null);

    await runAction(verifyPdfsAction, {
      modules: {
        presenter,
      },
    });

    expect(successStub).toHaveBeenCalled();
  });
});
