import { getTrialSessionWorkingCopyDataAction } from './getTrialSessionWorkingCopyDataAction';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';

describe('getTrialSessionWorkingCopyDataAction', () => {
  it('should return true', async () => {
    const filters = {
      aBasisReached: true,
      continued: false,
      dismissed: true,
      recall: true,
      rule122: false,
      setForTrial: false,
      settled: false,
      showAll: true,
      statusUnassigned: true,
      takenUnderAdvisement: true,
    };
    const sessionNotes = 'some notes here';
    const result = await runAction(getTrialSessionWorkingCopyDataAction, {
      modules: {
        presenter,
      },
      state: {
        trialSessionWorkingCopy: {
          filters,
          sessionNotes,
        },
      },
    });
    expect(result.output.filters).toEqual(filters);
    expect(result.output.sessionNotes).toEqual(sessionNotes);
  });
});
