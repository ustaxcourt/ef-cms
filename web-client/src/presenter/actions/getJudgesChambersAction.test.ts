import {
  JudgeChambersInfo,
  getJudgesChambersAction,
} from '@web-client/presenter/actions/getJudgesChambersAction';
import { ROLES } from '@shared/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('getJudgesChambersAction', () => {
  const MOCK_JUDGE_USERS = [
    {
      isSeniorJudge: false,
      judgeFullName: 'Test Judge 1',
      judgePhoneNumber: '(123) 123-1234',
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

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('gets the correct judgesChambers', async () => {
    applicationContext
      .getUseCases()
      .getUsersInSectionInteractor.mockReturnValue(MOCK_JUDGE_USERS);
    const { output } = await runAction(getJudgesChambersAction, {
      modules: {
        presenter,
      },
    });
    expect(output).toMatchObject({ judgesChambers: MOCK_JUDGES_CHAMBERS });
  });
});
