import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { unsetSessionNoteFromTrialSessionWorkingCopyAction } from './unsetSessionNoteFromTrialSessionWorkingCopyAction';

describe('unsetSessionNoteFromTrialSessionWorkingCopyAction', () => {
  it('should set the modal state', async () => {
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
