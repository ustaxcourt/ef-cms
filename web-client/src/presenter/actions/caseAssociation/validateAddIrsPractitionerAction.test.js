import { applicationContextForClient } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';
import { validateAddIrsPractitionerAction } from './validateAddIrsPractitionerAction';

describe('validateAddIrsPractitioner', () => {
  let successStub;
  let errorStub;
  let mockAddIrsPractitioner;

  beforeAll(() => {
    successStub = jest.fn();
    errorStub = jest.fn();

    mockAddIrsPractitioner = {
      user: { userId: 'abc' },
    };

    presenter.providers.applicationContext = applicationContextForClient;
    presenter.providers.path = {
      error: errorStub,
      success: successStub,
    };
  });

  it('should call the success path when no errors are found', async () => {
    applicationContextForClient
      .getUseCases()
      .validateAddIrsPractitionerInteractor.mockReturnValue(null);

    await runAction(validateAddIrsPractitionerAction, {
      modules: {
        presenter,
      },
      state: {
        form: mockAddIrsPractitioner,
      },
    });

    expect(
      applicationContextForClient.getUseCases()
        .validateAddIrsPractitionerInteractor,
    ).toHaveBeenCalled();
    expect(successStub).toHaveBeenCalledTimes(1);
  });

  it('should call the error path when any errors are found', async () => {
    applicationContextForClient
      .getUseCases()
      .validateAddIrsPractitionerInteractor.mockReturnValue('error');

    await runAction(validateAddIrsPractitionerAction, {
      modules: {
        presenter,
      },
      state: {
        form: mockAddIrsPractitioner,
      },
    });

    expect(
      applicationContextForClient.getUseCases()
        .validateAddIrsPractitionerInteractor,
    ).toHaveBeenCalled();
    expect(errorStub).toHaveBeenCalledTimes(1);
  });
});
