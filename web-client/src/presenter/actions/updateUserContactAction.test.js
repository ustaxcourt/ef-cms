import { presenter } from '../presenter';
import { runAction } from 'cerebral/test';
import { updateUserContactAction } from './updateUserContactAction';

const errorMock = jest.fn();
const successMock = jest.fn();

presenter.providers.path = {
  error: errorMock,
  success: successMock,
};
const updateUserMock = jest.fn();

presenter.providers.applicationContext = {
  getUseCases: () => {
    return {
      updateUserContactInformationInteractor: updateUserMock,
    };
  },
};

describe('updateUserContactAction', () => {
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
