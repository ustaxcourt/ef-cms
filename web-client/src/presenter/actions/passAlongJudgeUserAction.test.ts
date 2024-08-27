import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { judgeUser } from '@shared/test/mockUsers';
import { passAlongJudgeUserAction } from './passAlongJudgeUserAction';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('passAlongJudgeUserAction', () => {
  presenter.providers.applicationContext = applicationContext;

  it('should call the setItemInteractor to persists the tab and form', async () => {
    const { output } = await runAction(passAlongJudgeUserAction, {
      modules: {
        presenter,
      },
      props: {},
      state: {
        user: judgeUser,
      },
    });

    expect(output.judgeUser).toEqual(judgeUser);
  });
});
