import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import { updateSessionNoteInTrialSessionWorkingCopyAction } from './updateSessionNoteInTrialSessionWorkingCopyAction';

describe('updateSessionNoteInTrialSessionWorkingCopyAction', () => {
  it('should set the modal caseId state', async () => {
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
