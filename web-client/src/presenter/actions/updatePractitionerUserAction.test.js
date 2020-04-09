import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';
import { updatePractitionerUserAction } from './updatePractitionerUserAction';

describe('updatePractitionerUserAction', () => {
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

  it('calls the update practitioner user interactor', async () => {
    await runAction(updatePractitionerUserAction, {
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
      applicationContext.getUseCases().updatePractitionerUserInteractor,
    ).toHaveBeenCalled();
    expect(successMock).toHaveBeenCalled();
  });

  it('returns path.error if the use case throws an error', async () => {
    applicationContext
      .getUseCases()
      .updatePractitionerUserInteractor.mockImplementation(() => {
        throw new Error('bad!');
      });

    await runAction(updatePractitionerUserAction, {
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
      applicationContext.getUseCases().updatePractitionerUserInteractor,
    ).toHaveBeenCalled();
    expect(errorMock).toHaveBeenCalled();
  });
});
