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
  const successStub = jest.fn();
  const errorStub = jest.fn();

  const mockProps = {
    fileUploadProgressMap: {
      primary: {
        file: mockFile,
        uploadProgress: jest.fn(),
      },
    },
  };

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;

    presenter.providers.path = {
      error: errorStub,
      success: successStub,
    };
  });

  beforeEach(() => {
    applicationContext
      .getUseCases()
      .uploadDocumentInteractor.mockResolvedValue(mockDocketEntryId);
  });

  it('should make a call to upload the selected document with docketEntryId from state', async () => {
    await runAction(uploadDocketEntryFileAction, {
      modules: { presenter },
      props: mockProps,
      state: {
        docketEntryId: mockDocketEntryId,
      },
    });

    expect(
      applicationContext.getUseCases().uploadDocumentInteractor.mock
        .calls[0][1],
    ).toMatchObject({
      documentFile: mockFile,
      key: mockDocketEntryId,
      onUploadProgress: expect.any(Function),
    });
  });

  it('should return the error path when an error is thrown when attempting to upload the document file', async () => {
    applicationContext
      .getUseCases()
      .uploadDocumentInteractor.mockRejectedValue(new Error('whoopsie!'));

    await runAction(uploadDocketEntryFileAction, {
      modules: { presenter },
      state: {},
    });

    expect(errorStub).toHaveBeenCalled();
  });

  it('should return the success path with the docketEntryId when the document was uploaded successfully', async () => {
    await runAction(uploadDocketEntryFileAction, {
      modules: { presenter },
      props: mockProps,
      state: {
        docketEntryId: mockDocketEntryId,
      },
    });

    expect(successStub).toHaveBeenCalled();
    expect(successStub.mock.calls[0][0]).toMatchObject({
      docketEntryId: mockDocketEntryId,
    });
  });
});
