import { applicationContext } from '../../test/createTestApplicationContext';
import { getJudgeInSectionInteractor } from './getJudgeInSectionInteractor';
import { ROLES } from '../../entities/EntityConstants';

describe('getJudgeInSectionInteractor', () => {
  beforeEach(() => {
    applicationContext
      .getUseCaseHelpers()
      .getJudgeInSectionHelper.mockResolvedValue({
        judgeName: 'buch',
      });
  });

  it('throws an exception if a petitioner tries to get the judge of a section', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.petitioner,
    });

    await expect(() =>
      getJudgeInSectionInteractor(applicationContext, {
        section: 'buchsChambers',
      }),
    ).rejects.toThrow('Unauthorized');
  });

  it('returns the correct judge returned from the helper', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.judge,
    });

    expect(
      await getJudgeInSectionInteractor(applicationContext, {
        section: 'buchsChambers',
      }),
    ).toEqual({
      judgeName: 'buch',
    });
  });
});
