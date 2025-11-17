/* eslint-disable jest/no-conditional-expect */
import { ErrorWithStatusCode } from '../../errors/errors';
import { v2ApiWrapper } from './v2ApiWrapper';

type CapturedError = ErrorWithStatusCode & {
  toResponseBody(): { message: string; statusCode: number };
};

describe('v2ApiWrapper', () => {
  const throwWithStatus = (statusCode?: number, message?: string) => () => {
    const err = new Error(message) as ErrorWithStatusCode;
    err.statusCode = statusCode;
    throw err;
  };

  test('errors thrown during execution are 500s and serialized as the expected v1 error object', async () => {
    try {
      await v2ApiWrapper(throwWithStatus(undefined, 'Test error'));
    } catch (err) {
      const error = err as CapturedError;
      expect(error.message).toBe('Test error');
      expect(error.statusCode).toBe(500);
      expect(error.toResponseBody()).toEqual({
        message: 'Test error',
        statusCode: 500,
      });
    }
  });

  test('errors thrown are assigned generic message if none provided', async () => {
    try {
      await v2ApiWrapper(throwWithStatus(undefined));
    } catch (err) {
      const error = err as CapturedError;
      expect(error.message).toBe('An unexpected error occurred');
      expect(error.statusCode).toBe(500);
      expect(error.toResponseBody()).toEqual({
        message: 'An unexpected error occurred',
        statusCode: 500,
      });
    }
  });
  [401, 403, 404, 500].forEach(statusCode =>
    it(`error thrown preserves status code ${statusCode}`, () =>
      expect(() => v2ApiWrapper(throwWithStatus(statusCode))).rejects.toThrow(
        expect.objectContaining({ statusCode }),
      )),
  );

  [405, 429, 503].forEach(statusCode =>
    it(`errors with a status code ${statusCode} not indicated by the v2 spec are 500s`, () =>
      expect(() => v2ApiWrapper(throwWithStatus(statusCode))).rejects.toThrow(
        expect.objectContaining({ statusCode: 500 }),
      )),
  );

  // Workaround until https://github.com/ustaxcourt/ef-cms/pull/462 is resolved
  // (API returning 400 instead of 404 on unknown cases)
  test('Case validation errors are converted to 404s', async () => {
    await expect(() =>
      v2ApiWrapper(throwWithStatus(400, 'The Case entity was invalid')),
    ).rejects.toThrow(expect.objectContaining({ statusCode: 404 }));
  });
});
