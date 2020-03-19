import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import { validateAddIrsPractitionerAction } from './validateAddIrsPractitionerAction';

describe('validateAddIrsPractitioner', () => {
  let validateAddIrsPractitionerInteractorStub;
  let successStub;
  let errorStub;

  let mockAddIrsPractitioner;

  beforeEach(() => {
    validateAddIrsPractitionerInteractorStub = jest.fn();
    successStub = jest.fn();
    errorStub = jest.fn();

    mockAddIrsPractitioner = {
      user: { userId: 'abc' },
    };

    presenter.providers.applicationContext = {
      getUseCases: () => ({
        validateAddIrsPractitionerInteractor: validateAddIrsPractitionerInteractorStub,
      }),
    };

    presenter.providers.path = {
      error: errorStub,
      success: successStub,
    };
  });

  it('should call the success path when no errors are found', async () => {
    validateAddIrsPractitionerInteractorStub = jest.fn().mockReturnValue(null);
    await runAction(validateAddIrsPractitionerAction, {
      modules: {
        presenter,
      },
      state: {
        form: mockAddIrsPractitioner,
      },
    });

    expect(successStub.mock.calls.length).toEqual(1);
  });

  it('should call the error path when any errors are found', async () => {
    validateAddIrsPractitionerInteractorStub = jest
      .fn()
      .mockReturnValue('error');
    await runAction(validateAddIrsPractitionerAction, {
      modules: {
        presenter,
      },
      state: {
        form: mockAddIrsPractitioner,
      },
    });

    expect(errorStub.mock.calls.length).toEqual(1);
  });
});
