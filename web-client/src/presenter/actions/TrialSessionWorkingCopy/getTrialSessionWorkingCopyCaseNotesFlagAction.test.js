import { getTrialSessionWorkingCopyCaseNotesFlagAction } from './getTrialSessionWorkingCopyCaseNotesFlagAction';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';

describe('getTrialSessionWorkingCopyCaseNotesFlagAction', () => {
  it('should return true', async () => {
    const result = await runAction(
      getTrialSessionWorkingCopyCaseNotesFlagAction,
      {
        modules: {
          presenter,
        },
        state: {
          modal: {
            caseNotesFlag: true,
          },
        },
      },
    );
    expect(result.output.caseNotesFlag).toEqual(true);
  });

  it('should return false', async () => {
    const result = await runAction(
      getTrialSessionWorkingCopyCaseNotesFlagAction,
      {
        modules: {
          presenter,
        },
        state: {
          modal: {
            caseNotesFlag: false,
          },
        },
      },
    );
    expect(result.output.caseNotesFlag).toEqual(false);
  });
});
