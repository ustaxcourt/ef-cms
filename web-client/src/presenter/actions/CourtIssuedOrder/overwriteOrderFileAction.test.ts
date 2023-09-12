import { applicationContextForClient } from '@web-client/test/createClientTestApplicationContext';
import { overwriteOrderFileAction } from './overwriteOrderFileAction';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('overwriteOrderFileAction', () => {
  let errorStub;
  let successStub;

  beforeAll(() => {
    errorStub = jest.fn();
    successStub = jest.fn();

    presenter.providers.applicationContext = applicationContextForClient;
    presenter.providers.path = {
      error: errorStub,
      success: successStub,
    };
  });

  it('overwrites the file for an order', async () => {
    await runAction(overwriteOrderFileAction, {
      modules: {
        presenter,
      },
      state: {
        documentToEdit: {
          docketEntryId: 'document-id-123',
        },
        form: {
          primaryDocumentFile: {},
        },
      },
    });

    expect(
      applicationContextForClient.getUseCases().uploadOrderDocumentInteractor,
    ).toHaveBeenCalled();
  });

  it('fails to overwrite the file for an order', () => {
    applicationContextForClient
      .getUseCases()
      .uploadOrderDocumentInteractor.mockImplementation(() => {
        throw new Error();
      });

    runAction(overwriteOrderFileAction, {
      modules: { presenter },
      state: {
        documentToEdit: {
          docketEntryId: 'document-id-123',
        },
        form: {
          primaryDocumentFile: {},
        },
      },
    });

    expect(errorStub).toHaveBeenCalled();
  });
});
