import { appendFormAndOverwriteOrderFileAction } from './appendFormAndOverwriteOrderFileAction';
import { applicationContextForClient } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('appendFormAndOverwriteOrderFileAction', () => {
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
    await runAction(appendFormAndOverwriteOrderFileAction, {
      modules: {
        presenter,
      },
      state: {
        documentToEdit: {
          docketEntryId: 'document-id-123',
        },
      },
    });

    expect(
      applicationContextForClient.getUseCases()
        .appendAmendedPetitionFormInteractor,
    ).toHaveBeenCalled();
  });
});
