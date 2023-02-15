import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';
import { validateAddPetitionerAction } from './validateAddPetitionerAction';

describe('validateAddPetitionerAction', () => {
  let successMock;
  let errorMock;

  const { COUNTRY_TYPES } = applicationContext.getConstants();

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
      .validateAddPetitionerInteractor.mockReturnValue(null);

    runAction(validateAddPetitionerAction, {
      modules: {
        presenter,
      },
      props: {
        computedDate: '2019-03-01T21:40:46.415Z',
      },
      state: {
        form: {
          contact: {
            address1: '123 Some St.',
            city: 'Some City',
            countryType: COUNTRY_TYPES.DOMESTIC,
            phone: '123-123-1234',
            postalCode: '12345',
            state: 'AL',
          },
        },
      },
    });

    expect(successMock).toHaveBeenCalled();
  });

  it('returns the error path when the use case returns errors', () => {
    applicationContext
      .getUseCases()
      .validateAddPetitionerInteractor.mockReturnValue({
        address1: 'Enter an address',
      });

    runAction(validateAddPetitionerAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          contact: {
            address1: '123 Some St.',
            city: 'Some City',
            countryType: COUNTRY_TYPES.DOMESTIC,
            phone: '123-123-1234',
            postalCode: '12345',
            state: 'AL',
          },
        },
      },
    });

    expect(errorMock).toHaveBeenCalled();
  });

  it('returns the error path with nested contact errors if the use case returns contact errors', () => {
    applicationContext
      .getUseCases()
      .validateAddPetitionerInteractor.mockReturnValue({
        address1: 'Enter an address',
        state: 'Enter a state',
      });

    runAction(validateAddPetitionerAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          contact: {
            city: 'Some City',
            countryType: COUNTRY_TYPES.DOMESTIC,
            phone: '123-123-1234',
            postalCode: '12345',
          },
        },
      },
    });

    expect(errorMock).toHaveBeenCalled();
    expect(errorMock.mock.calls[0][0].errors).toEqual({
      contact: {
        address1: 'Enter an address',
        state: 'Enter a state',
      },
    });
  });
});
