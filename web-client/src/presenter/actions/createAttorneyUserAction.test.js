import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { createAttorneyUserAction } from './createAttorneyUserAction';
import { presenter } from '../presenter';
import { runAction } from 'cerebral/test';

presenter.providers.applicationContext = applicationContext;

const { createAttorneyUserInteractor } = applicationContext.getUseCases();

describe('createAttorneyUserAction', () => {
  let successMock;
  let errorMock;

  beforeEach(() => {
    successMock = jest.fn();
    errorMock = jest.fn();

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

    expect(createAttorneyUserInteractor).toHaveBeenCalled();
  });

  it('returns path.error if the use case throws an error', async () => {
    createAttorneyUserInteractor.mockImplementation(() => {
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

    expect(createAttorneyUserInteractor).toHaveBeenCalled();
    expect(errorMock).toHaveBeenCalled();
  });
});
