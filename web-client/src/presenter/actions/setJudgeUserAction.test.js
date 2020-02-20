import { runAction } from 'cerebral/test';
import { setJudgeUserAction } from './setJudgeUserAction';

const mockUser = {
  userId: '123',
};

describe('setJudgeUserAction', () => {
  it('sets state.judgeUser to the passed in props.judgeUser', async () => {
    const { state } = await runAction(setJudgeUserAction, {
      props: {
        judgeUser: mockUser,
      },
    });
    expect(state.judgeUser).toMatchObject(mockUser);
  });

  it('unsets state.judgeUser when props.judgeUser is not provided', async () => {
    const params = {
      props: {},
      state: {
        judgeUser: mockUser,
      },
    };

    const result = await runAction(setJudgeUserAction, params);

    expect(result.state.judgeUser).toBeUndefined();
  });
});
