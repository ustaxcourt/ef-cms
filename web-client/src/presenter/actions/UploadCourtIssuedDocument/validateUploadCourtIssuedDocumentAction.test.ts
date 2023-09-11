import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { validateUploadCourtIssuedDocumentAction } from './validateUploadCourtIssuedDocumentAction';

describe('validateUploadCourtIssuedDocumentAction', () => {
  let successStub;
  let errorStub;

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;

    successStub = jest.fn();
    errorStub = jest.fn();

    presenter.providers.path = {
      error: errorStub,
      success: successStub,
    };
  });

  it('should call path.success and not path.error if freeText and primaryDocumentFile are defined', async () => {
    await runAction(validateUploadCourtIssuedDocumentAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          freeText: 'Some text',
          primaryDocumentFile: '01010101',
        },
      },
    });

    expect(successStub).toHaveBeenCalled();
    expect(errorStub).not.toHaveBeenCalled();
  });

  it('should call path.error and not path.success if the form is missing its required fields', async () => {
    await runAction(validateUploadCourtIssuedDocumentAction, {
      modules: {
        presenter,
      },
      state: {
        form: {},
      },
    });

    expect(errorStub).toHaveBeenCalled();
    expect(successStub).not.toHaveBeenCalled();
  });
});
