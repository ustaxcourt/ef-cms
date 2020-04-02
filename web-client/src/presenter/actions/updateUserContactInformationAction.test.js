import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';
import { updateUserContactInformationAction } from './updateUserContactInformationAction';

describe('updateUserContactInformationAction', () => {
  let noChangeMock;
  let successMock;

  beforeAll(() => {
    noChangeMock = jest.fn();
    successMock = jest.fn();

    presenter.providers.applicationContext = applicationContext;
    presenter.providers.path = {
      noChange: noChangeMock,
      success: successMock,
    };
  });

  it('should gracefully handle other failures', async () => {
    applicationContext
      .getUseCases()
      .updateUserContactInformationInteractor.mockImplementation(() => {
        return Promise.reject(new Error('other kind of failure'));
      });

    let result, error;
    try {
      result = await runAction(updateUserContactInformationAction, {
        modules: {
          presenter,
        },
        state: { form: { contact: {} } },
      });
    } catch (e) {
      error = e;
    }
    expect(error).toBeDefined();
    expect(result).not.toBeDefined();
    expect(noChangeMock).not.toHaveBeenCalled();
  });

  it('should gracefully handle "no change found" failures', async () => {
    const err = new Error('update failed');
    err.originalError = {
      response: {
        data: 'there were no changes found needing to be updated',
      },
    };

    applicationContext
      .getUseCases()
      .updateUserContactInformationInteractor.mockImplementation(() => {
        return Promise.reject(err);
      });

    await runAction(updateUserContactInformationAction, {
      modules: {
        presenter,
      },
      state: { form: { contact: {} } },
    });
    expect(noChangeMock).toHaveBeenCalled();
  });

  it('should update the user and provide an alertSuccess message', async () => {
    applicationContext
      .getUseCases()
      .updateUserContactInformationInteractor.mockResolvedValue(true);

    await runAction(updateUserContactInformationAction, {
      modules: {
        presenter,
      },
      state: { form: { contact: {} } },
    });
    expect(
      applicationContext.getUseCases().updateUserContactInformationInteractor,
    ).toHaveBeenCalled();
    expect(successMock).toBeCalled();
  });
});
