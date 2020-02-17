import { presenter } from '../presenter';
import { runAction } from 'cerebral/test';
import { validateUserContactAction } from './validateUserContactAction';

const errorMock = jest.fn();
const successMock = jest.fn();

presenter.providers.path = {
  error: errorMock,
  success: successMock,
};

let validationResult;

presenter.providers.applicationContext = {
  getCurrentUser: () => ({
    userId: '123',
  }),
  getUseCases: () => {
    return {
      validateUserInteractor: () => {
        return validationResult;
      },
    };
  },
};

describe('validateUserContactAction', () => {
  it('should return the error path if user is invalid', async () => {
    validationResult = 'something went wrong';
    runAction(validateUserContactAction, {
      modules: {
        presenter,
      },
      state: {},
    });
    expect(errorMock).toHaveBeenCalled();
  });

  it('should return the success path if user is valid', async () => {
    validationResult = undefined;
    runAction(validateUserContactAction, {
      modules: {
        presenter,
      },
      state: {},
    });
    expect(successMock).toHaveBeenCalled();
  });
});
