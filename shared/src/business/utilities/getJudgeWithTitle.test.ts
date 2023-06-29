import { applicationContext } from '../test/createTestApplicationContext';
import { getJudgeWithTitle } from './getJudgeWithTitle';

describe('getJudgeWithTitle', () => {
  const mockJudgeUserName = 'Judy';
  const mockJudge = {
    judgFullName: 'Judifer Justice Judy',
    judgeTitle: 'Special Trial Judge',
    name: 'Judy',
  };

  beforeAll(() => {
    applicationContext
      .getPersistenceGateway()
      .getUsersInSection.mockReturnValue([mockJudge]);
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

    expect(result).toEqual(`${mockJudge.judgeTitle} ${mockJudge.name}`);
  });

  it('should return the found judge full name with title when useFullName is true', async () => {
    const result = await getJudgeWithTitle({
      applicationContext,
      judgeUserName: mockJudgeUserName,
      useFullName: true,
    });

    expect(result).toEqual(`${mockJudge.judgeTitle} ${mockJudge.fullName}`);
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
