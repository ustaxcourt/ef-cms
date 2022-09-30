import { getTrialSessionWorkingCopyShowCaseNotesAction } from './getTrialSessionWorkingCopyShowCaseNotesAction';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';

describe('getTrialSessionWorkingCopyShowCaseNotesAction', () => {
  it('should return true when showCaseNotes is true', async () => {
    const result = await runAction(
      getTrialSessionWorkingCopyShowCaseNotesAction,
      {
        modules: {
          presenter,
        },
        state: {
          modal: {
            showCaseNotes: true,
          },
        },
      },
    );
    expect(result.output.showCaseNotes).toEqual(true);
  });

  it('should return false when showCaseNotes is false', async () => {
    const result = await runAction(
      getTrialSessionWorkingCopyShowCaseNotesAction,
      {
        modules: {
          presenter,
        },
        state: {
          modal: {
            showCaseNotes: false,
          },
        },
      },
    );
    expect(result.output.showCaseNotes).toEqual(false);
  });
});
