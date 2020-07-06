import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';
import { validateAddPractitionerAction } from './validateAddPractitionerAction';

describe('validateAddPractitionerAction', () => {
  let successMock;
  let errorMock;

  const { COUNTRY_TYPES, USER_ROLES } = applicationContext.getConstants();

  beforeAll(() => {
    successMock = jest.fn();
    errorMock = jest.fn();

    presenter.providers.applicationContext = applicationContext;
    presenter.providers.path = {
      error: errorMock,
      success: successMock,
    };
  });

  it('returns the success path when the use case returns no errors', () => {
    applicationContext
      .getUseCases()
      .validateAddPractitionerInteractor.mockReturnValue(null);

    runAction(validateAddPractitionerAction, {
      modules: {
        presenter,
      },
      props: {
        computedDate: '2019-03-01T21:40:46.415Z',
      },
      state: {
        form: {
          barNumber: 'BN001',
          contact: {
            address1: '123 Some St.',
            city: 'Some City',
            countryType: COUNTRY_TYPES.DOMESTIC,
            phone: '123-123-1234',
            postalCode: '12345',
            state: 'AL',
          },
          email: 'test@example.com',
          firstName: 'Test',
          lastName: 'Attorney',
          originalBarState: 'Texas',
          role: USER_ROLES.privatePractitioner,
        },
      },
    });

    expect(successMock).toHaveBeenCalled();
  });

  it('returns the error path when the use case returns errors', () => {
    applicationContext
      .getUseCases()
      .validateAddPractitionerInteractor.mockReturnValue({
        firstName: 'Enter a first name',
      });

    runAction(validateAddPractitionerAction, {
      modules: {
        presenter,
      },
      props: {
        computedDate: '2019-03-01T21:40:46.415Z',
      },
      state: {
        form: {
          barNumber: 'BN001',
          contact: {
            address1: '123 Some St.',
            city: 'Some City',
            countryType: COUNTRY_TYPES.INTERNATIONAL,
            phone: '123-123-1234',
            postalCode: '12345',
          },
          email: 'test@example.com',
          originalBarState: 'Texas',
          role: USER_ROLES.privatePractitioner,
        },
      },
    });

    expect(errorMock).toHaveBeenCalled();
  });

  it('returns the error path with nested contact errors if the use case returns contact errors', () => {
    applicationContext
      .getUseCases()
      .validateAddPractitionerInteractor.mockReturnValue({
        address1: 'Enter a mailing address',
      });

    runAction(validateAddPractitionerAction, {
      modules: {
        presenter,
      },
      props: {
        computedDate: '2019-03-01T21:40:46.415Z',
      },
      state: {
        form: {
          barNumber: 'BN001',
          contact: {
            address1: '123 Some St.',
            city: 'Some City',
            countryType: COUNTRY_TYPES.INTERNATIONAL,
            phone: '123-123-1234',
            postalCode: '12345',
          },
          email: 'test@example.com',
          originalBarState: 'Texas',
          role: USER_ROLES.privatePractitioner,
        },
      },
    });

    expect(errorMock).toHaveBeenCalled();
    expect(errorMock.mock.calls[0][0].errors).toEqual({
      contact: {
        address1: 'Enter a mailing address',
      },
    });
  });
});
