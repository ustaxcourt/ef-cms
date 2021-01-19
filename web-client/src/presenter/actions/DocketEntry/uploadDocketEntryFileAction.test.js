import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';
import { uploadDocketEntryFileAction } from './uploadDocketEntryFileAction';

describe('uploadDocketEntryFileAction', () => {
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

  it('', async () => {
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
});
