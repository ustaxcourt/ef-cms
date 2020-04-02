import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';
import { updateAttorneyUserAction } from './updateAttorneyUserAction';

describe('updateAttorneyUserAction', () => {
  let successMock;
  let errorMock;

  beforeAll(() => {
    successMock = jest.fn();
    errorMock = jest.fn();

    presenter.providers.applicationContext = applicationContext;
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

    expect(
      applicationContext.getUseCases().updateAttorneyUserInteractor,
    ).toHaveBeenCalled();
    expect(successMock).toHaveBeenCalled();
  });

  it('returns path.error if the use case throws an error', async () => {
    applicationContext
      .getUseCases()
      .updateAttorneyUserInteractor.mockImplementation(() => {
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

    expect(
      applicationContext.getUseCases().updateAttorneyUserInteractor,
    ).toHaveBeenCalled();
    expect(errorMock).toHaveBeenCalled();
  });
});
