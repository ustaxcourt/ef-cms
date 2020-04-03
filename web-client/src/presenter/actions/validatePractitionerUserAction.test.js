import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';
import { validatePractitionerUserAction } from './validatePractitionerUserAction';

describe('validatePractitionerUserAction', () => {
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

  it('returns the success path when valid practitioner user data is given with domestic contact info', async () => {
    await runAction(validatePractitionerUserAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          barNumber: 'BN001',
          contact: {
            address1: '123 Some St.',
            city: 'Some City',
            countryType: 'domestic',
            phone: '123-123-1234',
            postalCode: '12345',
            state: 'ST',
          },
          email: 'test@example.com',
          name: 'Test Attorney',
          role: 'privatePractitioner',
        },
      },
    });

    expect(successMock).toHaveBeenCalled();
  });

  it('returns the success path when valid practitioner user data is given with international contact info', async () => {
    await runAction(validatePractitionerUserAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          barNumber: 'BN001',
          contact: {
            address1: '123 Some St.',
            city: 'Some City',
            country: 'Some Country',
            countryType: 'international',
            phone: '123-123-1234',
            postalCode: '12345',
          },
          email: 'test@example.com',
          name: 'Test Attorney',
          role: 'privatePractitioner',
        },
      },
    });

    expect(successMock).toHaveBeenCalled();
  });

  it('returns the error path when the practitioner user data given is missing the `name` field', async () => {
    await runAction(validatePractitionerUserAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          barNumber: 'BN001',
          contact: {
            address1: '123 Some St.',
            city: 'Some City',
            countryType: 'international',
            phone: '123-123-1234',
            postalCode: '12345',
          },
          email: 'test@example.com',
          role: 'privatePractitioner',
        },
      },
    });

    expect(errorMock).toHaveBeenCalled();
  });

  it('returns the error path when the practitioner user data given is missing the `barNumber` field', async () => {
    await runAction(validatePractitionerUserAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          contact: {
            address1: '123 Some St.',
            city: 'Some City',
            countryType: 'international',
            phone: '123-123-1234',
            postalCode: '12345',
          },
          email: 'test@example.com',
          name: 'Test Attorney',
          role: 'privatePractitioner',
        },
      },
    });

    expect(errorMock).toHaveBeenCalled();
  });

  it('returns the error path when the practitioner user data given is missing the `email` field', async () => {
    await runAction(validatePractitionerUserAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          barNumber: 'BN001',
          contact: {
            address1: '123 Some St.',
            city: 'Some City',
            countryType: 'domestic',
            phone: '123-123-1234',
            postalCode: '12345',
            state: 'ST',
          },
          name: 'Test Attorney',
          role: 'privatePractitioner',
        },
      },
    });

    expect(errorMock).toHaveBeenCalled();
  });

  it('returns the error path when the practitioner user data given is missing the `role` field', async () => {
    await runAction(validatePractitionerUserAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          barNumber: 'BN001',
          contact: {
            address1: '123 Some St.',
            city: 'Some City',
            countryType: 'domestic',
            phone: '123-123-1234',
            postalCode: '12345',
            state: 'ST',
          },
          email: 'test@example.com',
          name: 'Test Attorney',
        },
      },
    });

    expect(errorMock).toHaveBeenCalled();
  });

  it('returns the error path when the practitioner user data is given with domestic contact info and missing the `state` field', async () => {
    await runAction(validatePractitionerUserAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          barNumber: 'BN001',
          contact: {
            address1: '123 Some St.',
            city: 'Some City',
            countryType: 'domestic',
            phone: '123-123-1234',
            postalCode: '12345',
          },
          email: 'test@example.com',
          name: 'Test Attorney',
          role: 'privatePractitioner',
        },
      },
    });

    expect(errorMock).toHaveBeenCalled();
  });

  it('returns the error path when the practitioner user data is given with international contact info and missing the `country` field', async () => {
    await runAction(validatePractitionerUserAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          barNumber: 'BN001',
          contact: {
            address1: '123 Some St.',
            city: 'Some City',
            countryType: 'international',
            phone: '123-123-1234',
            postalCode: '12345',
          },
          email: 'test@example.com',
          name: 'Test Attorney',
          role: 'privatePractitioner',
        },
      },
    });

    expect(errorMock).toHaveBeenCalled();
  });
});
