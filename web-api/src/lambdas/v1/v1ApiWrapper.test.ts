/* eslint-disable jest/no-conditional-expect */
import { ErrorWithStatusCode } from '../../errors/errors';
import { v1ApiWrapper } from './v1ApiWrapper';
type CapturedError = ErrorWithStatusCode & {
  toResponseBody(): { message: string; statusCode: number };
};

describe('v1ApiWrapper', () => {
  const throwWithStatus = (statusCode?: number, message?: string) => () => {
    const err: ErrorWithStatusCode = Object.assign(new Error(message), {
      statusCode,
    });
    throw err;
  };

  test('errors thrown during execution are 500s and serialized as the expected v1 error object', async () => {
    try {
      await v1ApiWrapper(throwWithStatus(undefined, 'Test error'));
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
      await v1ApiWrapper(throwWithStatus(undefined));
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
      expect(() => v1ApiWrapper(throwWithStatus(statusCode))).rejects.toThrow(
        expect.objectContaining({ statusCode }),
      )),
  );

  [405, 429, 503].forEach(statusCode =>
    it(`errors with a status code ${statusCode} not indicated by the v1 spec are 500s`, () =>
      expect(() => v1ApiWrapper(throwWithStatus(statusCode))).rejects.toThrow(
        expect.objectContaining({ statusCode: 500 }),
      )),
  );

  // Workaround until https://github.com/ustaxcourt/ef-cms/pull/462 is resolved
  // (API returning 400 instead of 404 on unknown cases)
  test('Case validation errors are converted to 404s', async () => {
    await expect(() =>
      v1ApiWrapper(throwWithStatus(400, 'The Case entity was invalid')),
    ).rejects.toThrow(expect.objectContaining({ statusCode: 404 }));
  });
});
