import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { uploadDocketEntryFileAction } from './uploadDocketEntryFileAction';

describe('uploadDocketEntryFileAction', () => {
  const mockDocketEntryId = '7dc7c871-6fc4-4274-85ed-63b0c14465bd';
  const mockFile = {
    name: 'petition',
    size: 100,
  };

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

  it('should make a call to upload the selected document with docketEntryId from state', async () => {
    await runAction(uploadDocketEntryFileAction, {
      modules: { presenter },
      state: {
        docketEntryId: mockDocketEntryId,
        form: {
          primaryDocumentFile: mockFile,
        },
      },
    });

    expect(
      applicationContext.getUseCases().uploadDocumentInteractor.mock
        .calls[0][1],
    ).toMatchObject({
      documentFile: mockFile,
      key: mockDocketEntryId,
    });
  });

  it('should return the error path when an error is thrown when attempting to upload the document file', async () => {
    applicationContext
      .getUseCases()
      .uploadDocumentInteractor.mockRejectedValueOnce(new Error('whoopsie!'));

    await runAction(uploadDocketEntryFileAction, {
      modules: { presenter },
      state: {
        form: {
          primaryDocumentFile: {},
        },
      },
    });

    expect(errorStub).toHaveBeenCalled();
  });

  it('should return the success path with the docketEntryId when the document was uploaded successfully', async () => {
    await applicationContext
      .getUseCases()
      .uploadDocumentInteractor.mockReturnValue(mockDocketEntryId);

    await runAction(uploadDocketEntryFileAction, {
      modules: { presenter },
      state: {
        docketEntryId: mockDocketEntryId,
        form: {
          primaryDocumentFile: mockFile,
        },
      },
    });

    expect(successStub).toHaveBeenCalled();
    expect(successStub.mock.calls[0][0]).toMatchObject({
      docketEntryId: mockDocketEntryId,
    });
  });
});
