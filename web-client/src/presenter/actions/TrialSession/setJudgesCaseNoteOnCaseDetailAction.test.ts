import { runAction } from '@web-client/presenter/test.cerebral';
import { setJudgesCaseNoteOnCaseDetailAction } from './setJudgesCaseNoteOnCaseDetailAction';

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
