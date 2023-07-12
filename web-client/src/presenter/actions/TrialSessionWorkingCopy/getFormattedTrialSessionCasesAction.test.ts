import { getFormattedTrialSessionCasesAction } from './getFormattedTrialSessionCasesAction';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('getFormattedTrialSessionCasesAction', () => {
  it('should return an empty object if there are no formatted cases', async () => {
    const result = await runAction(getFormattedTrialSessionCasesAction, {
      modules: {
        presenter,
      },
      state: {
        trialSessionWorkingCopyHelper: {},
      },
    });
    expect(result.output.formattedCases).toEqual([]);
  });

  it('should return a list of formatted cases', async () => {
    const formattedCases = [{}];
    const result = await runAction(getFormattedTrialSessionCasesAction, {
      modules: {
        presenter,
      },
      state: {
        trialSessionWorkingCopyHelper: {
          formattedCases,
        },
      },
    });
    expect(result.output.formattedCases).toEqual(formattedCases);
  });
});
