import { ROLES } from '../../../../shared/src/business/entities/EntityConstants';
import { applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { getJudgeInSectionHelper } from './getJudgeInSectionHelper';

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

    applicationContext
      .getPersistenceGateway()
      .getUsersInSection.mockResolvedValue([
        expectedJudgeUser,
        {
          name: 'some other petitioner that should not be returned',
          role: ROLES.petitioner,
          section: 'judgesChambers',
          userId: 'dadbad42-18d0-43ec-bafb-654e83405416',
        },
      ]);

    const result = await getJudgeInSectionHelper(applicationContext, {
      section: 'judgesChambers2',
    });

    expect(result).toMatchObject(expectedJudgeUser);
    expect(
      applicationContext.getPersistenceGateway().getUsersInSection,
    ).toHaveBeenCalled();
  });

  it('Returns no user if the given user is not associated with any chambers section', async () => {
    applicationContext
      .getPersistenceGateway()
      .getUsersInSection.mockResolvedValue([
        {
          name: 'petitioner',
          role: ROLES.petitioner,
          section: 'judgesChambers',
          userId: 'dadbad42-18d0-43ec-bafb-654e83405416',
        },
      ]);
    const result = await getJudgeInSectionHelper(applicationContext, {
      section: 'colvinChambers',
    });

    expect(result).toBeUndefined();
  });
});
