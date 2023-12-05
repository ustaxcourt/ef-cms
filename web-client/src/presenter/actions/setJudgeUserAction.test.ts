import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { judgeUser } from '@shared/test/mockUsers';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setJudgeUserAction } from './setJudgeUserAction';

describe('setJudgeUserAction', () => {
  presenter.providers.applicationContext = applicationContext;

  it('sets state.judgeUser to the passed in props.judgeUser', async () => {
    const { state } = await runAction(setJudgeUserAction, {
      modules: { presenter },
      props: {
        judgeUser,
      },
    });
    expect(state.judgeUser).toMatchObject(judgeUser);
  });
});
