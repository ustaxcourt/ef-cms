import '@web-api/persistence/postgres/users/mocks.jest';
import { getJudgeWithTitle } from './getJudgeWithTitle';

import { getUsersInSections as getUsersInSectionsMock } from '@web-api/persistence/postgres/users/getUsersInSections';
import { DbUser } from '@web-api/persistence/postgres/users/mapper';
import { ROLES } from '@shared/business/entities/EntityConstants';

const getUsersInSections = jest.mocked(getUsersInSectionsMock);

describe('getJudgeWithTitle', () => {
  const mockJudgeUserName = 'Judy';
  const mockJudge = {
    judgeFullName: 'Judifer Justice Judy',
    judgeTitle: 'Special Trial Judge',
    name: 'Judy',
    userId: 'a174c566-8606-48e2-916d-325e943d6ed3',
    role: ROLES.judge,
    email: 'judge@example.com',
  } as DbUser;

  beforeAll(() => {
    getUsersInSections.mockResolvedValue([mockJudge as DbUser]);
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

    expect(result).toEqual(
      `${mockJudge.judgeTitle} ${mockJudge.judgeFullName}`,
    );
  });

  it('throws an error when the specified judge is not found in persistence', async () => {
    await expect(
      getJudgeWithTitle({
        judgeUserName: 'Shrek',
      }),
    ).rejects.toThrow('Judge Shrek was not found');
  });
});
