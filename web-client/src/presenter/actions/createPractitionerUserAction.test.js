import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { createPractitionerUserAction } from './createPractitionerUserAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

describe('createPractitionerUserAction', () => {
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

  it('should set confirmEmail to undefined on the practitioner user', async () => {
    await runAction(createPractitionerUserAction, {
      modules: {
        presenter,
      },
      props: {
        computedDate: '2019-03-01T21:40:46.415Z',
      },
      state: {
        form: {
          confirmEmail: 'something@example.com',
        },
      },
    });

    expect(
      applicationContext.getUseCases().createPractitionerUserInteractor.mock
        .calls[0][1].user,
    ).toMatchObject({
      confirmEmail: undefined,
    });
  });

  it('should set admissions date on the practitioner user from props', async () => {
    const mockComputedAdmissionsDate = '2019-03-01T21:40:46.415Z';

    await runAction(createPractitionerUserAction, {
      modules: {
        presenter,
      },
      props: {
        computedDate: mockComputedAdmissionsDate,
      },
      state: {
        form: {
          user: {},
        },
      },
    });

    expect(
      applicationContext.getUseCases().createPractitionerUserInteractor.mock
        .calls[0][1].user,
    ).toMatchObject({
      admissionsDate: mockComputedAdmissionsDate,
    });
  });

  it('should return path.success with a success message and practitioner information when the practitioner user was successfully created', async () => {
    const mockPractitioner = {
      barNumber: 'AB1234',
      name: 'Donna Harking',
    };
    applicationContext
      .getUseCases()
      .createPractitionerUserInteractor.mockReturnValue(mockPractitioner);

    await runAction(createPractitionerUserAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          user: {},
        },
      },
    });

    expect(successMock.mock.calls[0][0]).toMatchObject({
      alertSuccess: {
        message: 'Practitioner added.',
      },
      barNumber: mockPractitioner.barNumber,
      practitionerUser: mockPractitioner,
    });
  });

  it('should return path.error when the practitioner to create is invalid', async () => {
    applicationContext
      .getUseCases()
      .createPractitionerUserInteractor.mockImplementation(() => {
        throw new Error('bad!');
      });

    await runAction(createPractitionerUserAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          user: {},
        },
      },
    });

    expect(errorMock).toHaveBeenCalled();
  });
});
