import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import { setQcCompleteOnCaseOnTrialSessionAction } from './setQcCompleteOnCaseOnTrialSessionAction';

describe('setQcCompleteOnCaseOnTrialSessionAction', () => {
  it('sets the props.trialSession on state.form, splitting the startDate into month, day, and year', async () => {
    const result = await runAction(setQcCompleteOnCaseOnTrialSessionAction, {
      modules: {
        presenter,
      },
      props: {
        updatedCase: {
          caseId: '98dc2266-0f81-4b4b-9ff5-fd02dfb012f7',
          qcCompleteForTrial: { 'c2f09db1-24a1-4cff-a0cd-8c7b331f60d8': true },
        },
      },
      state: {
        trialSession: {
          eligibleCases: [
            {
              caseId: '98dc2266-0f81-4b4b-9ff5-fd02dfb012f7',
              qcCompleteForTrial: {
                'c2f09db1-24a1-4cff-a0cd-8c7b331f60d8': false,
              },
            },
          ],
        },
      },
    });

    expect(result.state.trialSession.eligibleCases[0]).toEqual({
      caseId: '98dc2266-0f81-4b4b-9ff5-fd02dfb012f7',
      qcCompleteForTrial: {
        'c2f09db1-24a1-4cff-a0cd-8c7b331f60d8': true,
      },
    });
  });
});
