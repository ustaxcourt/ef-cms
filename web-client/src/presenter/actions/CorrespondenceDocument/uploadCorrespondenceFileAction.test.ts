import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../../presenter';
import { runAction } from '@web-client/presenter/test.cerebral';
import { uploadCorrespondenceFileAction } from './uploadCorrespondenceFileAction';

describe('uploadCorrespondenceFileAction', () => {
  let successStub;
  let errorStub;

  beforeEach(() => {
    presenter.providers.applicationContext = applicationContext;

    successStub = jest.fn();
    errorStub = jest.fn();

    presenter.providers.path = {
      error: errorStub,
      success: successStub,
    };

    applicationContext
      .getUseCases()
      .uploadCorrespondenceDocumentInteractor.mockResolvedValue(
        'correspondence-document-id-123',
      );
  });

  it('uploads the correspondence document to s3 successfully', async () => {
    await runAction(uploadCorrespondenceFileAction, {
      modules: {
        presenter,
      },
      state: {
        form: { primaryDocumentFile: {} },
      },
    });

    expect(
      applicationContext.getUseCases().uploadCorrespondenceDocumentInteractor,
    ).toHaveBeenCalled();
    expect(successStub).toHaveBeenCalled();
  });

  it('fails to upload the correspondence document to s3', async () => {
    applicationContext
      .getUseCases()
      .uploadCorrespondenceDocumentInteractor.mockImplementation(() => {
        throw new Error('failed to upload');
      });

    await runAction(uploadCorrespondenceFileAction, {
      modules: { presenter },
      state: {
        form: { primaryDocumentFile: {} },
      },
    });

    expect(errorStub).toHaveBeenCalled();
  });
});
