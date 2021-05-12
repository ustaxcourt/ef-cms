const { v1ApiWrapper } = require('./v1ApiWrapper');

describe('v1ApiWrapper', () => {
  const throwWithStatus =
    (statusCode, message = 'Test error') =>
    () => {
      const err = new Error(message);
      err.statusCode = statusCode;
      throw err;
    };

  test('errors thrown during execution are 500s and serialized as the expected v1 error object', async () => {
    try {
      await v1ApiWrapper(throwWithStatus(undefined));
    } catch (err) {
      /* eslint-disable jest/no-try-expect */
      expect(JSON.stringify(err.message)).toBe('{"message":"Test error"}');
      expect(err.statusCode).toBe(500);
      /* eslint-enable jest/no-try-expect */
    }
  });

  test('errors with status code of 401, 403, 404, or 500 are preserved', async () => {
    await expect(() => v1ApiWrapper(throwWithStatus(401))).rejects.toThrow(
      expect.objectContaining({ statusCode: 401 }),
    );

    await expect(() => v1ApiWrapper(throwWithStatus(403))).rejects.toThrow(
      expect.objectContaining({ statusCode: 403 }),
    );

    await expect(() => v1ApiWrapper(throwWithStatus(404))).rejects.toThrow(
      expect.objectContaining({ statusCode: 404 }),
    );

    await expect(() => v1ApiWrapper(throwWithStatus(500))).rejects.toThrow(
      expect.objectContaining({ statusCode: 500 }),
    );
  });

  test('errors with a status code not indicated by the v1 spec are 500s', async () => {
    await expect(() => v1ApiWrapper(throwWithStatus(405))).rejects.toThrow(
      expect.objectContaining({ statusCode: 500 }),
    );
    await expect(() => v1ApiWrapper(throwWithStatus(503))).rejects.toThrow(
      expect.objectContaining({ statusCode: 500 }),
    );
  });

  // Workaround until https://github.com/ustaxcourt/ef-cms/pull/462 is resolved
  // (API returning 400 instead of 404 on unknown cases)
  test('Case validation errors are converted to 404s', async () => {
    await expect(() =>
      v1ApiWrapper(throwWithStatus(400, 'The Case entity was invalid')),
    ).rejects.toThrow(expect.objectContaining({ statusCode: 404 }));
  });
});
