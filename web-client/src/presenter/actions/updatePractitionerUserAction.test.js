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
    applicationContext
      .getUseCases()
      .updatePractitionerUserInteractor.mockReturnValue({
        barNumber: 'AB1111',
      });

    await runAction(updatePractitionerUserAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          barNumber: 'AB1111',
          firstName: 'Joe',
          lastName: 'Exotic',
        },
      },
    });

    expect(
      applicationContext.getUseCases().updatePractitionerUserInteractor,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getUseCases().updatePractitionerUserInteractor.mock
        .calls[0][1],
    ).toMatchObject({
      barNumber: 'AB1111',
      user: { firstName: 'Joe', lastName: 'Exotic' },
    });
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
    expect(errorMock).toHaveBeenCalledWith({
      alertError: {
        message: 'Please try again.',
        title: 'Practitioner could not be edited.',
      },
    });
  });
});
