import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { validateUploadCorrespondenceDocumentAction } from './validateUploadCorrespondenceDocumentAction';

describe('validateUploadCorrespondenceDocumentAction', () => {
  const successStub = jest.fn();
  const errorStub = jest.fn();

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;

    presenter.providers.path = {
      error: errorStub,
      success: successStub,
    };
  });

  it('should call path.success and not path.error if documentTitle and primaryDocumentFile are defined', async () => {
    await runAction(validateUploadCorrespondenceDocumentAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          documentTitle: 'Some text',
          primaryDocumentFile: '01010101',
        },
      },
    });

    expect(successStub).toHaveBeenCalled();
    expect(errorStub).not.toHaveBeenCalled();
  });

  it('should call path.error and not path.success if the form is missing its required fields', async () => {
    await runAction(validateUploadCorrespondenceDocumentAction, {
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
