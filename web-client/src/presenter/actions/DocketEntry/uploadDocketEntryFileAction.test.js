import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';
import { uploadDocketEntryFileAction } from './uploadDocketEntryFileAction';

describe('uploadDocketEntryFileAction', () => {
  const mockDocketEntryId = '7dc7c871-6fc4-4274-85ed-63b0c14465bd';
  const fakeFile = {
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

  it('should call make a call to upload the selected document with docketEntryId from state', async () => {
    await runAction(uploadDocketEntryFileAction, {
      modules: { presenter },
      state: {
        docketEntryId: mockDocketEntryId,
        form: {
          primaryDocumentFile: fakeFile,
        },
      },
    });

    expect(
      applicationContext.getUseCases().uploadDocumentInteractor.mock
        .calls[0][1],
    ).toMatchObject({
      documentFile: fakeFile,
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

  it('should return the success with a generated primaryDocumentFileId and docketEntryId when the document was uploaded successfully', async () => {
    const mockPrimaryDocumentFileId = 'd85a87c1-fb13-4c1c-b2f6-cf89c43718a1';

    await applicationContext
      .getUseCases()
      .uploadDocumentInteractor.mockReturnValue(mockPrimaryDocumentFileId);

    await runAction(uploadDocketEntryFileAction, {
      modules: { presenter },
      state: {
        docketEntryId: mockDocketEntryId,
        form: {
          primaryDocumentFile: fakeFile,
        },
      },
    });

    expect(successStub).toHaveBeenCalled();
    expect(successStub.mock.calls[0][0]).toMatchObject({
      docketEntryId: mockPrimaryDocumentFileId,
      primaryDocumentFileId: mockPrimaryDocumentFileId,
    });
  });
});
