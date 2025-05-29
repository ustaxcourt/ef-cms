import { runAction } from '@web-client/presenter/test.cerebral';
import { setEligibleCasesForLocationAction } from './setEligibleCasesForLocationAction';

describe('setEligibleCasesForLocationAction', () => {
  it('sets eligible cases for the location', async () => {
    const result = await runAction(setEligibleCasesForLocationAction, {
      props: {
        eligibleCases: [
          {
            caseId: '1',
            caseTitle: 'Case One',
            trialCity: 'Boise, Idaho',
          },
          {
            caseId: '2',
            caseTitle: 'Case Two',
            trialCity: 'Boise, Idaho',
          },
        ],
      },
    });

    expect(result.state.trialLocationPage.eligibleCases).toMatchObject([
      {
        caseId: '1',
        caseTitle: 'Case One',
        trialCity: 'Boise, Idaho',
      },
      {
        caseId: '2',
        caseTitle: 'Case Two',
        trialCity: 'Boise, Idaho',
      },
    ]);
  });
});
