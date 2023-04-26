import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';
import { validateFileAction } from './validateFileAction';

describe('validateFileAction', () => {
  let pathSuccessStub;
  let pathErrorStub;

  beforeAll(() => {
    pathSuccessStub = jest.fn();
    pathErrorStub = jest.fn();

    presenter.providers.path = {
      error: pathErrorStub,
      success: pathSuccessStub,
    };

    presenter.providers.applicationContext = applicationContext;
  });

  it('should call the error path when an error occurs when validating the file', async () => {
    applicationContext
      .getUseCases()
      .validateFileInteractor.mockImplementation(() => {
        throw new Error('This file looks super bad. I hate it.');
      });

    await runAction(validateFileAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          primaryDocumentFile: '',
        },
      },
    });

    expect(pathErrorStub).toHaveBeenCalled();
  });

  it('should call the success path when no error occurs when validating the file', async () => {
    applicationContext
      .getUseCases()
      .validateFileInteractor.mockImplementation(() => null);

    await runAction(validateFileAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          primaryDocumentFile: '',
        },
      },
    });

    expect(pathSuccessStub).toHaveBeenCalled();
  });
});
