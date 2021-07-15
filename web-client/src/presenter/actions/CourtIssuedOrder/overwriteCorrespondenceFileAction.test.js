import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { overwriteCorrespondenceFileAction } from './overwriteCorrespondenceFileAction';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';

describe('overwriteCorrespondenceFileAction', () => {
  const errorStub = jest.fn();
  const successStub = jest.fn();

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;

    presenter.providers.path = {
      error: errorStub,
      success: successStub,
    };
  });

  it('returns the success path with the docketEntryId when the correspondence file was successfully uploaded', async () => {
    applicationContext
      .getUseCases()
      .uploadCorrespondenceDocumentInteractor.mockReturnValue(
        'document-id-123',
      );

    await runAction(overwriteCorrespondenceFileAction, {
      modules: {
        presenter,
      },
      state: {
        docketEntryId: 'document-id-123',
        form: {
          primaryDocumentFile: {},
        },
      },
    });

    expect(
      applicationContext.getUseCases().uploadCorrespondenceDocumentInteractor,
    ).toBeCalled();
    expect(
      applicationContext.getUseCases().uploadCorrespondenceDocumentInteractor
        .mock.calls[0][1],
    ).toMatchObject({
      keyToOverwrite: 'document-id-123',
    });
    expect(successStub).toHaveBeenCalledWith({
      primaryDocumentFileId: 'document-id-123',
    });
  });

  it('returns the error path when the correspondence file failed to upload', () => {
    applicationContext
      .getUseCases()
      .uploadCorrespondenceDocumentInteractor.mockImplementation(() => {
        throw new Error();
      });

    runAction(overwriteCorrespondenceFileAction, {
      modules: { presenter },
      state: {
        docketEntryId: 'document-id-123',
        form: {
          primaryDocumentFile: {},
        },
      },
    });

    expect(errorStub).toBeCalled();
  });
});
