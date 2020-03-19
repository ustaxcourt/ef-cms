import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import { validateAddPrivatePractitionerAction } from './validateAddPrivatePractitionerAction';

describe('validateAddPrivatePractitioner', () => {
  let validateAddPrivatePractitionerInteractorStub;
  let successStub;
  let errorStub;

  let mockAddPrivatePractitioner;

  beforeEach(() => {
    validateAddPrivatePractitionerInteractorStub = jest.fn();
    successStub = jest.fn();
    errorStub = jest.fn();

    mockAddPrivatePractitioner = {
      representingPrimary: true,
      user: { userId: 'abc' },
    };

    presenter.providers.applicationContext = {
      getUseCases: () => ({
        validateAddPrivatePractitionerInteractor: validateAddPrivatePractitionerInteractorStub,
      }),
    };

    presenter.providers.path = {
      error: errorStub,
      success: successStub,
    };
  });

  it('should call the success path when no errors are found', async () => {
    validateAddPrivatePractitionerInteractorStub = jest
      .fn()
      .mockReturnValue(null);
    await runAction(validateAddPrivatePractitionerAction, {
      modules: {
        presenter,
      },
      state: {
        form: mockAddPrivatePractitioner,
      },
    });

    expect(successStub.mock.calls.length).toEqual(1);
  });

  it('should call the error path when any errors are found', async () => {
    validateAddPrivatePractitionerInteractorStub = jest
      .fn()
      .mockReturnValue('error');
    await runAction(validateAddPrivatePractitionerAction, {
      modules: {
        presenter,
      },
      state: {
        form: mockAddPrivatePractitioner,
      },
    });

    expect(errorStub.mock.calls.length).toEqual(1);
  });
});
