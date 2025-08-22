jest.mock('@web-api/persistence/postgres/users/getUsersInSections');
import { getUsersInSections as getUsersInSectionsMock } from '@web-api/persistence/postgres/users/getUsersInSections';
import {
  ACCOUNT_STATUS,
  ROLES,
} from '../../../../shared/src/business/entities/EntityConstants';
import { getJudgeInSectionHelper } from './getJudgeInSectionHelper';
import { DbUser } from '@web-api/persistence/postgres/users/mapper';

describe('getJudgeInSectionHelper', () => {
  const getUsersInSections = jest.mocked(getUsersInSectionsMock);
  it('Fetches the judge associated with a given section', async () => {
    const expectedJudgeUser = {
      isSeniorJudge: false,
      judgeFullName: 'judge',
      judgeTitle: 'Judge',
      name: 'judge',
      role: ROLES.judge,
      section: 'judgesChambers',
      userId: 'dadbad42-18d0-43ec-bafb-654e83405416',
      accountStatus: ACCOUNT_STATUS.active,
    };

    getUsersInSections.mockResolvedValue([
      expectedJudgeUser as DbUser,
      {
        name: 'some other petitioner that should not be returned',
        role: ROLES.petitioner,
        section: 'judgesChambers',
        accountStatus: ACCOUNT_STATUS.active,
        userId: 'dadbad42-18d0-43ec-bafb-654e83405416',
      } as DbUser,
    ]);

    const result = await getJudgeInSectionHelper({
      section: 'judgesChambers2',
    });

    expect(result).toMatchObject(expectedJudgeUser);
    expect(getUsersInSections).toHaveBeenCalled();
  });

  it('Returns no user if the given user is not associated with any chambers section', async () => {
    getUsersInSections.mockResolvedValue([
      {
        name: 'petitioner',
        role: ROLES.petitioner,
        section: 'judgesChambers',
        userId: 'dadbad42-18d0-43ec-bafb-654e83405416',
        accountStatus: ACCOUNT_STATUS.active,
      } as DbUser,
    ]);
    const result = await getJudgeInSectionHelper({
      section: 'colvinChambers',
    });

    expect(result).toBeUndefined();
  });
});
