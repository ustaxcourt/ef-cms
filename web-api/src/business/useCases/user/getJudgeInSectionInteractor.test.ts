import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { getJudgeInSectionInteractor } from './getJudgeInSectionInteractor';
import { mockJudgeUser, mockPetitionerUser } from '@shared/test/mockAuthUsers';

describe('getJudgeInSectionInteractor', () => {
  beforeEach(() => {
    applicationContext
      .getUseCaseHelpers()
      .getJudgeInSectionHelper.mockResolvedValue({
        judgeName: 'buch',
      });
  });

  it('throws an exception if a petitioner tries to get the judge of a section', async () => {
    await expect(() =>
      getJudgeInSectionInteractor(
        applicationContext,
        {
          section: 'buchsChambers',
        },
        mockPetitionerUser,
      ),
    ).rejects.toThrow('Unauthorized');
  });

  it('returns the correct judge returned from the helper', async () => {
    expect(
      await getJudgeInSectionInteractor(
        applicationContext,
        {
          section: 'buchsChambers',
        },
        mockJudgeUser,
      ),
    ).toEqual({
      judgeName: 'buch',
    });
  });
});
