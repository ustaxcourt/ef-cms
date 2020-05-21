import { applicationContextForClient } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { overwriteCorrespondenceFileAction } from './overwriteCorrespondenceFileAction';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';

describe('overwriteCorrespondenceFileAction', () => {
  const errorStub = jest.fn();
  const successStub = jest.fn();

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContextForClient;

    presenter.providers.path = {
      error: errorStub,
      success: successStub,
    };
  });

  it('returns the success path with the documentId when the correspondence file was successfully uploaded', async () => {
    applicationContextForClient
      .getUseCases()
      .uploadCorrespondenceDocumentInteractor.mockReturnValue(
        'document-id-123',
      );

    await runAction(overwriteCorrespondenceFileAction, {
      modules: {
        presenter,
      },
      state: {
        documentToEdit: {
          documentId: 'document-id-123',
        },
        form: {
          primaryDocumentFile: {},
        },
      },
    });

    expect(
      applicationContextForClient.getUseCases()
        .uploadCorrespondenceDocumentInteractor,
    ).toBeCalled();
    expect(successStub).toHaveBeenCalledWith({
      primaryDocumentFileId: 'document-id-123',
    });
  });

  it('returns the error path when the correspondence file failed to upload', async () => {
    applicationContextForClient
      .getUseCases()
      .uploadCorrespondenceDocumentInteractor.mockImplementation(() => {
        throw new Error();
      });

    runAction(overwriteCorrespondenceFileAction, {
      modules: { presenter },
      state: {
        documentToEdit: {
          documentId: 'document-id-123',
        },
        form: {
          primaryDocumentFile: {},
        },
      },
    });

    expect(errorStub).toBeCalled();
  });
});
