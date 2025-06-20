import '@web-api/persistence/postgres/users/mocks.jest';
import { ROLES } from '@shared/business/entities/EntityConstants';
import { getJudgeInSectionHelper } from './getJudgeInSectionHelper';
import { getUsersInSections as getUsersInSectionMock } from '@web-api/persistence/postgres/users/getUsersInSection';

const getUsersInSection = getUsersInSectionMock as jest.Mock;

describe('getJudgeInSectionHelper', () => {
  it('Fetches the judge associated with a given section', async () => {
    const expectedJudgeUser = {
      isSeniorJudge: false,
      judgeFullName: 'judge',
      judgeTitle: 'Judge',
      name: 'judge',
      role: ROLES.judge,
      section: 'judgesChambers',
      userId: 'dadbad42-18d0-43ec-bafb-654e83405416',
    };

    getUsersInSection.mockResolvedValue([
      expectedJudgeUser,
      {
        name: 'some other petitioner that should not be returned',
        role: ROLES.petitioner,
        section: 'judgesChambers',
        userId: 'dadbad42-18d0-43ec-bafb-654e83405416',
      },
    ]);

    const result = await getJudgeInSectionHelper({
      section: 'judgesChambers2',
    });

    expect(result).toMatchObject(expectedJudgeUser);
    expect(getUsersInSection).toHaveBeenCalled();
  });

  it('Returns no user if the given user is not associated with any chambers section', async () => {
    getUsersInSection.mockResolvedValue([
      {
        name: 'petitioner',
        role: ROLES.petitioner,
        section: 'judgesChambers',
        userId: 'dadbad42-18d0-43ec-bafb-654e83405416',
      },
    ]);
    const result = await getJudgeInSectionHelper({
      section: 'colvinChambers',
    });

    expect(result).toBeUndefined();
  });
});
