import decorateWithTryCatch from './tryCatchDecorator';
import { ServerInvalidResponseError } from './presenter/errors/ServerInvalidResponseError';
import { InvalidRequestError } from './presenter/errors/InvalidRequestError';
import { UnauthorizedRequestError } from './presenter/errors/UnauthorizedRequestError';
import { ActionError } from './presenter/errors/ActionError';

describe('decorateWithTryCatch', () => {
  it('catches and returns the expected error on 500 status', async () => {
    const functions = {
      fun: function() {
        return Promise.reject({
          response: {
            status: '500',
          },
        });
      },
    };
    decorateWithTryCatch(functions);
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
      fun: function() {
        return Promise.reject({
          response: {
            status: '400',
          },
        });
      },
    };
    decorateWithTryCatch(functions);
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
      fun: function() {
        return Promise.reject({
          response: {
            status: 401,
          },
        });
      },
    };
    decorateWithTryCatch(functions);
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
      fun: function() {
        return Promise.reject({
          response: {
            status: '200',
          },
        });
      },
    };
    decorateWithTryCatch(functions);
    let error;
    try {
      await functions.fun();
    } catch (err) {
      error = err;
    }
    expect(error instanceof ActionError).toBeTruthy();
  });
});
