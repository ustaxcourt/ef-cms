import { getTestJudgesChambers } from '@shared/test/mockJudgesChambers';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setJudgesChambersAction } from '@web-client/presenter/actions/setJudgesChambersAction';

describe('setJudgesChambersAction', () => {
  const judgesChambers = Object.values(getTestJudgesChambers());

  it('sets state.judgesChambers to the passed in props.judgesChambers', async () => {
    const { state } = await runAction(setJudgesChambersAction, {
      props: {
        judgesChambers,
      },
    });
    expect(state.judgesChambers).toMatchObject(judgesChambers);
  });
});
