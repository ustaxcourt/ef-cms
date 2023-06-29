import { v1ApiWrapper } from './v1ApiWrapper';

describe('v1ApiWrapper', () => {
  const throwWithStatus = (statusCode, message) => () => {
    const err = new Error(message);
    err.statusCode = statusCode;
    throw err;
  };

  test('errors thrown during execution are 500s and serialized as the expected v1 error object', async () => {
    try {
      await v1ApiWrapper(throwWithStatus(undefined, 'Test error'));
    } catch (err) {
      expect(JSON.stringify(err.message)).toBe('{"message":"Test error"}');
      expect(err.statusCode).toBe(500);
    }
  });

  test('errors thrown are assigned generic message if none provided', async () => {
    try {
      await v1ApiWrapper(throwWithStatus(undefined));
    } catch (err) {
      expect(JSON.stringify(err.message)).toBe(
        '{"message":"An unexpected error occurred"}',
      );
      expect(err.statusCode).toBe(500);
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
