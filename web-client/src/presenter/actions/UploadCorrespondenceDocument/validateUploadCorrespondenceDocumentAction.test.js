import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';
import { validateUploadCorrespondenceDocumentAction } from './validateUploadCorrespondenceDocumentAction';

describe('validateUploadCorrespondenceDocumentAction', () => {
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
    await runAction(validateUploadCorrespondenceDocumentAction, {
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
