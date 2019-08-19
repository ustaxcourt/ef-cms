import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import { unsetSessionNoteFromTrialSessionWorkingCopyAction } from './unsetSessionNoteFromTrialSessionWorkingCopyAction';

describe('unsetSessionNoteFromTrialSessionWorkingCopyAction', () => {
  it('should set the modal caseId state', async () => {
    const result = await runAction(
      unsetSessionNoteFromTrialSessionWorkingCopyAction,
      {
        modules: {
          presenter,
        },
        state: {
          trialSessionWorkingCopy: {
            sessionNotes: 'here are some notes',
          },
        },
      },
    );

    expect(result.state.trialSessionWorkingCopy).toEqual({});
  });
});
