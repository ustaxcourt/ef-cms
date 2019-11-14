import { presenter } from '../presenter';
import { runAction } from 'cerebral/test';
import { updateUserContactAction } from './updateUserContactAction';

const noChangeMock = jest.fn();
const successMock = jest.fn();

presenter.providers.path = {
  noChange: noChangeMock,
  success: successMock,
};
const updateUserMock = jest
  .fn()
  .mockImplementationOnce(() => {
    return Promise.reject(new Error('other kind of failure'));
  })
  .mockImplementationOnce(() => {
    const err = new Error('update failed');
    err.originalError = {
      response: {
        data: 'there were no changes found needing to be updated',
      },
    };
    return Promise.reject(err);
  })

  .mockImplementation(() => true);

presenter.providers.applicationContext = {
  getUseCases: () => ({
    updateUserContactInformationInteractor: updateUserMock,
  }),
};

describe('updateUserContactAction', () => {
  it('should gracefully handle other failures', async () => {
    let result, error;
    try {
      result = await runAction(updateUserContactAction, {
        modules: {
          presenter,
        },
        state: {},
      });
    } catch (e) {
      error = e;
    }
    expect(error).toBeDefined();
    expect(result).not.toBeDefined();
    expect(noChangeMock).not.toHaveBeenCalled();
  });
  it('should gracefully handle "no change found" failures', async () => {
    await runAction(updateUserContactAction, {
      modules: {
        presenter,
      },
      state: {},
    });
    expect(noChangeMock).toHaveBeenCalled();
  });
  it('should update the user and provide an alertSuccess message', async () => {
    await runAction(updateUserContactAction, {
      modules: {
        presenter,
      },
      state: {},
    });
    expect(updateUserMock).toHaveBeenCalled();
    expect(successMock).toBeCalled();
  });
});
