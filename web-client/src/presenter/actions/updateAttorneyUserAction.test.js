import { presenter } from '../presenter';
import { runAction } from 'cerebral/test';
import { updateAttorneyUserAction } from './updateAttorneyUserAction';

describe('updateAttorneyUserAction', () => {
  let updateAttorneyUserInteractorMock;
  let successMock;
  let errorMock;

  beforeEach(() => {
    updateAttorneyUserInteractorMock = jest.fn();
    successMock = jest.fn();
    errorMock = jest.fn();

    presenter.providers.applicationContext = {
      getUseCases: () => ({
        updateAttorneyUserInteractor: updateAttorneyUserInteractorMock,
      }),
    };

    presenter.providers.path = {
      error: errorMock,
      success: successMock,
    };
  });

  it('calls the update attorney user interactor', async () => {
    await runAction(updateAttorneyUserAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          user: {},
        },
      },
    });

    expect(updateAttorneyUserInteractorMock).toHaveBeenCalled();
    expect(successMock).toHaveBeenCalled();
  });

  it('returns path.error if the use case throws an error', async () => {
    updateAttorneyUserInteractorMock = jest.fn().mockImplementation(() => {
      throw new Error('bad!');
    });

    await runAction(updateAttorneyUserAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          user: {},
        },
      },
    });

    expect(updateAttorneyUserInteractorMock).toHaveBeenCalled();
    expect(errorMock).toHaveBeenCalled();
  });
});
