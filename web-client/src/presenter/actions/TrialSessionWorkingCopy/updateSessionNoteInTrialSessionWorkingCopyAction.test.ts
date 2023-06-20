import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { updateSessionNoteInTrialSessionWorkingCopyAction } from './updateSessionNoteInTrialSessionWorkingCopyAction';

describe('updateSessionNoteInTrialSessionWorkingCopyAction', () => {
  it('should set the modal state', async () => {
    const result = await runAction(
      updateSessionNoteInTrialSessionWorkingCopyAction,
      {
        modules: {
          presenter,
        },
        props: {
          notes: 'we are a family',
        },
        state: {
          trialSessionWorkingCopy: {},
        },
      },
    );

    expect(result.state.trialSessionWorkingCopy.sessionNotes).toEqual(
      'we are a family',
    );
  });
});
