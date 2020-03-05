import { createAttorneyUserAction } from './createAttorneyUserAction';
import { presenter } from '../presenter';
import { runAction } from 'cerebral/test';

describe('createAttorneyUserAction', () => {
  let createAttorneyUserInteractorMock;
  let successMock;
  let errorMock;

  beforeEach(() => {
    createAttorneyUserInteractorMock = jest.fn();
    successMock = jest.fn();
    errorMock = jest.fn();

    presenter.providers.applicationContext = {
      getUseCases: () => ({
        createAttorneyUserInteractor: createAttorneyUserInteractorMock,
      }),
    };

    presenter.providers.path = {
      error: errorMock,
      success: successMock,
    };
  });
  it('calls the create attorney user interactor', async () => {
    await runAction(createAttorneyUserAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          user: {},
        },
      },
    });

    expect(createAttorneyUserInteractorMock).toHaveBeenCalled();
  });

  it('returns path.error if the use case throws an error', async () => {
    createAttorneyUserInteractorMock = jest.fn().mockImplementation(() => {
      throw new Error('bad!');
    });

    await runAction(createAttorneyUserAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          user: {},
        },
      },
    });

    expect(createAttorneyUserInteractorMock).toHaveBeenCalled();
    expect(errorMock).toHaveBeenCalled();
  });
});
