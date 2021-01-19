const { applicationContext } = require('../test/createTestApplicationContext');
const { getJudgeWithTitle } = require('./getJudgeWithTitle');

describe('getJudgeWithTitle', () => {
  const mockJudgeUserName = 'Judy';
  const mockJudgesFromPersistence = [
    { judgeTitle: 'Special Trial Judge', name: 'Judy' },
  ];

  beforeAll(() => {
    applicationContext
      .getPersistenceGateway()
      .getUsersInSection.mockReturnValue(mockJudgesFromPersistence);
  });

  it('retrieves a list of judges from persistence', async () => {
    await getJudgeWithTitle({
      applicationContext,
      judgeUserName: mockJudgeUserName,
    });
    expect(
      applicationContext.getPersistenceGateway().getUsersInSection,
    ).toHaveBeenCalled();
  });

  it('returns the found judge name with title', async () => {
    const result = await getJudgeWithTitle({
      applicationContext,
      judgeUserName: mockJudgeUserName,
    });
    expect(result).toEqual('Special Trial Judge Judy');
  });

  it('throws an error when the specified judge is not found in persistence', async () => {
    await expect(
      getJudgeWithTitle({
        applicationContext,
        judgeUserName: 'Shrek',
      }),
    ).rejects.toThrow('Judge Shrek was not found');
  });
});
