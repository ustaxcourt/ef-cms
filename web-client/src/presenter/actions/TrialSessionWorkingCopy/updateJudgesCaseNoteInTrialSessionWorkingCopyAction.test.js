import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import { updateJudgesCaseNoteInTrialSessionWorkingCopyAction } from './updateJudgesCaseNoteInTrialSessionWorkingCopyAction';

describe('updateJudgesCaseNoteInTrialSessionWorkingCopyAction', () => {
  it('should set the modal caseId state', async () => {
    const result = await runAction(
      updateJudgesCaseNoteInTrialSessionWorkingCopyAction,
      {
        modules: {
          presenter,
        },
        props: {
          docketNumber: '123',
          notes: 'we are a family',
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

    expect(
      result.state.trialSessionWorkingCopy.caseMetadata['123'].notes,
    ).toEqual('we are a family');
  });
});
