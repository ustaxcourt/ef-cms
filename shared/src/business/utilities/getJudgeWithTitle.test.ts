import '@web-api/persistence/postgres/users/mocks.jest';
import { getJudgeWithTitle } from './getJudgeWithTitle';

import { getUsersInSections as getUsersInSectionsMock } from '@web-api/persistence/postgres/users/getUsersInSections';

const getUsersInSections = jest.mocked(getUsersInSectionsMock);

describe('getJudgeWithTitle', () => {
  const mockJudgeUserName = 'Judy';
  const mockJudge = {
    judgFullName: 'Judifer Justice Judy',
    judgeTitle: 'Special Trial Judge',
    name: 'Judy',
  };

  beforeAll(() => {
    getUsersInSections.mockResolvedValue([mockJudge]);
  });

  it('retrieves a list of judges from persistence', async () => {
    await getJudgeWithTitle({
      judgeUserName: mockJudgeUserName,
    });
    expect(getUsersInSections).toHaveBeenCalled();
  });

  it('returns the found judge name with title', async () => {
    const result = await getJudgeWithTitle({
      judgeUserName: mockJudgeUserName,
    });

    expect(result).toEqual(`${mockJudge.judgeTitle} ${mockJudge.name}`);
  });

  it('should return the found judge full name with title when useFullName is true', async () => {
    const result = await getJudgeWithTitle({
      judgeUserName: mockJudgeUserName,
      useFullName: true,
    });

    expect(result).toEqual(`${mockJudge.judgeTitle} ${mockJudge.fullName}`);
  });

  it('throws an error when the specified judge is not found in persistence', async () => {
    await expect(
      getJudgeWithTitle({
        judgeUserName: 'Shrek',
      }),
    ).rejects.toThrow('Judge Shrek was not found');
  });
});
