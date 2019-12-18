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
});
