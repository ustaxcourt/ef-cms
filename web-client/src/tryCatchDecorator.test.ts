import { ActionError } from './presenter/errors/ActionError';
import { InvalidRequestError } from './presenter/errors/InvalidRequestError';
import { ServerInvalidResponseError } from './presenter/errors/ServerInvalidResponseError';
import { UnauthorizedRequestError } from './presenter/errors/UnauthorizedRequestError';
import { UnidentifiedUserError } from './presenter/errors/UnidentifiedUserError';
import { tryCatchDecorator } from './tryCatchDecorator';

describe('decorateWithTryCatch', () => {
  it('directly returns function result when response is not a promise', () => {
    const functions = {
      fun() {
        return { passthrough: 'something not asynchronous that succeeds' };
      },
    };
    tryCatchDecorator(functions);
    const result = functions.fun();
    expect(result.passthrough).toBeDefined();
  });

  it('catches and returns the expected error on 500 status', async () => {
    const functions = {
      fun() {
        return Promise.reject({
          response: {
            status: '500',
          },
        });
      },
    };
    tryCatchDecorator(functions);
    let error;
    try {
      await functions.fun();
    } catch (err) {
      error = err;
    }
    expect(error instanceof ServerInvalidResponseError).toBeTruthy();
  });

  it('catches and returns the expected error on 400 status', async () => {
    const functions = {
      fun() {
        return Promise.reject({
          response: {
            status: '400',
          },
        });
      },
    };
    tryCatchDecorator(functions);
    let error;
    try {
      await functions.fun();
    } catch (err) {
      error = err;
    }
    expect(error instanceof InvalidRequestError).toBeTruthy();
  });

  it('catches and returns the expected error on 401 status', async () => {
    const functions = {
      fun() {
        return Promise.reject({
          response: {
            status: 401,
          },
        });
      },
    };
    tryCatchDecorator(functions);
    let error;
    try {
      await functions.fun();
    } catch (err) {
      error = err;
    }
    expect(error instanceof UnidentifiedUserError).toBeTruthy();
  });
  it('catches and returns the expected error on 403 status', async () => {
    const functions = {
      fun() {
        return Promise.reject({
          response: {
            status: 403,
          },
        });
      },
    };
    tryCatchDecorator(functions);
    let error;
    try {
      await functions.fun();
    } catch (err) {
      error = err;
    }
    expect(error instanceof UnauthorizedRequestError).toBeTruthy();
  });

  it('catches and returns the expected error on other error', async () => {
    const functions = {
      fun() {
        return Promise.reject({
          response: {
            status: '200',
          },
        });
      },
    };
    tryCatchDecorator(functions);
    let error;
    try {
      await functions.fun();
    } catch (err) {
      error = err;
    }
    expect(error instanceof ActionError).toBeTruthy();
  });
});
