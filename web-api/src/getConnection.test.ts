import { getConnection } from '@web-api/getConnection';

jest.doMock('@web-api/database', () => ({
  getDbReader: cb => cb(fakeReader),
}));

const mockExecute = jest.fn().mockResolvedValue(undefined);
const fakeReader = { executeQuery: mockExecute };

describe('getConnection', () => {
  it('should not establish multiple connections at the same time', async () => {
    const [db1, db2, db3] = await Promise.all([
      getConnection(),
      getConnection(),
      getConnection(),
    ]);

    expect(new Set([db1, db2, db3]).size).toBe(1);
  });
});
