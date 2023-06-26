import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setQcCompleteOnCaseOnTrialSessionAction } from './setQcCompleteOnCaseOnTrialSessionAction';

describe('setQcCompleteOnCaseOnTrialSessionAction', () => {
  it('sets the updated qcCompleteForTrial value from the updated case on the state.trialSession.eligibleCases', async () => {
    const result = await runAction(setQcCompleteOnCaseOnTrialSessionAction, {
      modules: {
        presenter,
      },
      props: {
        updatedCase: {
          docketNumber: '123-45',
          qcCompleteForTrial: { 'c2f09db1-24a1-4cff-a0cd-8c7b331f60d8': true },
        },
      },
      state: {
        trialSession: {
          eligibleCases: [
            {
              docketNumber: '123-45',
              qcCompleteForTrial: {
                'c2f09db1-24a1-4cff-a0cd-8c7b331f60d8': false,
              },
            },
          ],
        },
      },
    });

    expect(result.state.trialSession.eligibleCases[0]).toEqual({
      docketNumber: '123-45',
      qcCompleteForTrial: {
        'c2f09db1-24a1-4cff-a0cd-8c7b331f60d8': true,
      },
    });
  });
});
