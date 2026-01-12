import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { updatePractitionerUserAction } from './updatePractitionerUserAction';
import { dojPractitionerUser } from '@shared/test/mockUsers';

describe('updatePractitionerUserAction', () => {
  let successMock;
  let errorMock;
  const testClientConnectionId = 'testId';
  const testPractitioner = {
    ...dojPractitionerUser,
    admissionsStatus: 'Active',
    name: undefined,
  };
  const testBarNumber = 'AB1111';

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
        barNumber: testBarNumber,
      });

    await runAction(updatePractitionerUserAction, {
      modules: {
        presenter,
      },
      state: {
        clientConnectionId: testClientConnectionId,
        form: {
          ...testPractitioner,
          barNumber: testBarNumber,
          firstName: 'Joe',
          lastName: 'Exotic',
          testExtra: 'testExtra',
        },
      },
    });

    expect(
      applicationContext.getUseCases().updatePractitionerUserInteractor,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getUseCases().updatePractitionerUserInteractor.mock
        .calls[0][1],
    ).toEqual({
      clientConnectionId: testClientConnectionId,
      barNumber: testBarNumber,
      user: {
        ...testPractitioner,
        firstName: 'Joe',
        lastName: 'Exotic',
        barNumber: testBarNumber,
        name: 'Joe Exotic',
      },
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
