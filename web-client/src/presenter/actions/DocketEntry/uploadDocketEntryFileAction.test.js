import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';
import { uploadDocketEntryFileAction } from './uploadDocketEntryFileAction';

describe('uploadDocketEntryFileAction', () => {
  const fakeFile = {
    name: 'petition',
    size: 100,
  };

  const mockDocketEntryIdFromProps = '1d9e0af6-bb31-4dad-a465-bf2a52b1c7da';
  const mockDocketEntryIdFromState = '7dc7c871-6fc4-4274-85ed-63b0c14465bd';

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

  it('should return the error path when an error is thrown when attempting to upload the document file', async () => {
    applicationContext
      .getUseCases()
      .uploadDocumentInteractor.mockRejectedValue(new Error('whoopsie!'));

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

  it('should call uploadDocumentInteractor with state.form.primaryDocumentFile and props.docketEntryId', async () => {
    await runAction(uploadDocketEntryFileAction, {
      modules: { presenter },
      props: { docketEntryId: mockDocketEntryIdFromProps },
      state: {
        form: {
          primaryDocumentFile: fakeFile,
        },
      },
    });

    expect(
      applicationContext.getUseCases().uploadDocumentInteractor,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getUseCases().uploadDocumentInteractor.mock
        .calls[0][1],
    ).toMatchObject({
      documentFile: fakeFile,
      key: mockDocketEntryIdFromProps,
    });
  });

  it('should call uploadDocumentInteractor with state.docketEntryId when props.docketEntryId is undefined', async () => {
    await runAction(uploadDocketEntryFileAction, {
      modules: { presenter },
      props: { docketEntryId: undefined },
      state: {
        docketEntryId: mockDocketEntryIdFromState,
        form: {
          primaryDocumentFile: fakeFile,
        },
      },
    });

    expect(
      applicationContext.getUseCases().uploadDocumentInteractor,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getUseCases().uploadDocumentInteractor.mock
        .calls[0][1],
    ).toMatchObject({
      documentFile: fakeFile,
      key: mockDocketEntryIdFromState,
    });
  });

  it('should call path.success with a generated primaryDocumentFileId and docketEntryId', async () => {
    const mockPrimaryDocumentFileId = 'd85a87c1-fb13-4c1c-b2f6-cf89c43718a1';

    await applicationContext
      .getUseCases()
      .uploadDocumentInteractor.mockReturnValue(mockPrimaryDocumentFileId);

    await runAction(uploadDocketEntryFileAction, {
      modules: { presenter },
      props: { docketEntryId: undefined },
      state: {
        docketEntryId: mockDocketEntryIdFromState,
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
