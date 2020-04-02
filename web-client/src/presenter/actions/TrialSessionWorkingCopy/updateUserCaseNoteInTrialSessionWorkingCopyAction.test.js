import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';
import { updateUserCaseNoteInTrialSessionWorkingCopyAction } from './updateUserCaseNoteInTrialSessionWorkingCopyAction';

describe('updateUserCaseNoteInTrialSessionWorkingCopyAction', () => {
  it('should set the modal caseId state', async () => {
    const result = await runAction(
      updateUserCaseNoteInTrialSessionWorkingCopyAction,
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
