import { computeJudgeNameWithTitleAction } from './computeJudgeNameWithTitleAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('computeJudgeNameWithTitleAction', () => {
  it('fetches the given props.judge from state and returns the judge name with title', async () => {
    const result = await runAction(computeJudgeNameWithTitleAction, {
      props: {
        judge: 'Dredd',
      },
      state: {
        judges: [
          {
            judgeTitle: 'Judge',
            name: 'Dredd',
          },
        ],
      },
    });

    expect(result.output.judgeWithTitle).toEqual('Judge Dredd');
  });

  it('fetches the given state.form.judge from state and returns the judge name with title when props.judge is not given', async () => {
    const result = await runAction(computeJudgeNameWithTitleAction, {
      props: {},
      state: {
        form: {
          judge: 'Dredd',
        },
        judges: [
          {
            judgeTitle: 'Judge',
            name: 'Dredd',
          },
        ],
      },
    });

    expect(result.output.judgeWithTitle).toEqual('Judge Dredd');
  });

  it('returns the given judge name without the title if the judge is not found on state.judges', async () => {
    const result = await runAction(computeJudgeNameWithTitleAction, {
      props: {
        judge: 'Roy Scream',
      },
      state: {
        judges: [
          {
            judgeTitle: 'Judge',
            name: 'Dredd',
          },
        ],
      },
    });

    expect(result.output.judgeWithTitle).toEqual('Roy Scream');
  });

  it('returns judgeWithTitle undefined when neither state.form.judge or props.judge are given', async () => {
    const result = await runAction(computeJudgeNameWithTitleAction, {
      props: {},
      state: {
        form: {},
        judges: [
          {
            judgeTitle: 'Judge',
            name: 'Dredd',
          },
        ],
      },
    });

    expect(result.output.judgeWithTitle).toEqual(undefined);
  });
});
