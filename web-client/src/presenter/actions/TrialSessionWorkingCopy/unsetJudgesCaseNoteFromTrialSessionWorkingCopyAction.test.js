import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import { unsetJudgesCaseNoteFromTrialSessionWorkingCopyAction } from './unsetJudgesCaseNoteFromTrialSessionWorkingCopyAction';

describe('unsetJudgesCaseNoteFromTrialSessionWorkingCopyAction', () => {
  it('should set the modal caseId state', async () => {
    const result = await runAction(
      unsetJudgesCaseNoteFromTrialSessionWorkingCopyAction,
      {
        modules: {
          presenter,
        },
        props: {
          docketNumber: '123',
        },
        state: {
          trialSessionWorkingCopy: {
            caseMetadata: {
              '123': {
                notes: 'here are some notes',
              },
            },
          },
        },
      },
    );

    expect(result.state.trialSessionWorkingCopy.caseMetadata['123']).toEqual(
      {},
    );
  });
});
