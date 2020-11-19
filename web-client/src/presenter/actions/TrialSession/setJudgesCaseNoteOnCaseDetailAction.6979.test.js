import { runAction } from 'cerebral/test';
import { setJudgesCaseNoteOnCaseDetailAction } from './setJudgesCaseNoteOnCaseDetailAction.6979';

describe('setJudgesCaseNoteOnCaseDetailAction', () => {
  it('sets default trial session detail tab', async () => {
    const result = await runAction(setJudgesCaseNoteOnCaseDetailAction, {
      props: {
        userNote: 'welcome to flavortown',
      },
    });

    expect(result.state.judgesNote).toEqual('welcome to flavortown');
  });
});
