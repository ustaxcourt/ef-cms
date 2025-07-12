import { getDb } from '@web-api/persistence/postgres/databaseConnection';

jest.doMock('@web-api/persistence/postgres/databaseConnection', () => ({
  getDbReader: cb => cb(fakeReader),
}));

const mockExecute = jest.fn().mockResolvedValue(undefined);
const fakeReader = { executeQuery: mockExecute };

describe('getDb', () => {
  it('should not establish multiple database pools at the same time', async () => {
    const [db1, db2, db3] = await Promise.all([getDb(), getDb(), getDb()]);

    expect(new Set([db1, db2, db3]).size).toBe(1);
  });
});
