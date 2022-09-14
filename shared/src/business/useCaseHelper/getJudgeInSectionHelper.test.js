const { applicationContext } = require('../test/createTestApplicationContext');
const { getJudgeInSectionHelper } = require('./getJudgeInSectionHelper');
const { ROLES } = require('../entities/EntityConstants');

let currentUser;

describe('getJudgeInSectionHelper', () => {
  beforeEach(() => {
    applicationContext.getCurrentUser.mockImplementation(() => currentUser);
  });

  it('Fetches the judge associated with a given section', async () => {
    const expectedJudgeUser = {
      judgeFullName: 'judge',
      judgeTitle: 'judge',
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
