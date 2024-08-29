import { JudgeChambersInfo } from '@shared/proxies/users/getJudgesChambersProxy';
import { ROLES } from '../../../../../shared/src/business/entities/EntityConstants';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { getJudgesChambersInteractor } from './getJudgesChambersInteractor';
import { mockJudgeUser, mockPetitionerUser } from '@shared/test/mockAuthUsers';

const MOCK_JUDGE_USERS = [
  {
    contact: {
      phone: '(123) 123-1234',
    },
    isSeniorJudge: false,
    judgeFullName: 'Test Judge 1',
    judgeTitle: 'Judge',
    name: 'Test Judge 1',
    role: ROLES.judge,
    section: 'testJudge1sChambers',
    userId: 'ce5add74-1559-448d-a67d-c887c8351b2e',
  },
  {
    isSeniorJudge: false,
    judgeFullName: 'Test Judge 2',
    judgeTitle: 'Judge',
    name: 'Test Judge 2',
    role: ROLES.judge,
    section: 'testJudge2sChambers',
    userId: 'ea83cea2-5ce9-451d-b3d6-1e7c0e51d311',
  },
];

const MOCK_JUDGES_CHAMBERS: JudgeChambersInfo[] = [
  {
    isLegacy: false,
    judgeFullName: 'Test Judge 1',
    label: 'Test Judge 1’s Chambers',
    phoneNumber: '(123) 123-1234',
    section: 'testJudge1sChambers',
  },
  {
    isLegacy: false,
    judgeFullName: 'Test Judge 2',
    label: 'Test Judge 2’s Chambers',
    phoneNumber: undefined,
    section: 'testJudge2sChambers',
  },
];

describe('getJudgesChambersInteractor', () => {
  it('throws an exception if a petitioner tries to get the chambers', async () => {
    await expect(() =>
      getJudgesChambersInteractor(applicationContext, mockPetitionerUser),
    ).rejects.toThrow('Unauthorized');
  });

  it('returns the correct chambers', async () => {
    applicationContext
      .getPersistenceGateway()
      .getUsersInSection.mockReturnValue(MOCK_JUDGE_USERS);
    const result = await getJudgesChambersInteractor(
      applicationContext,
      mockJudgeUser,
    );

    expect(result).toMatchObject(MOCK_JUDGES_CHAMBERS);
  });
});
