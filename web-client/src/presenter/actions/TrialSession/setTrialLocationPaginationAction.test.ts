import { runAction } from '@web-client/presenter/test.cerebral';
import { setTrialLocationPaginationAction } from './setTrialLocationPaginationAction';

describe('setTrialLocationPaginationAction', () => {
  it('should set state.trialLocationPage[props.pageType] to the provided pageNumber', async () => {
    const result = await runAction(setTrialLocationPaginationAction, {
      props: {
        pageNumber: 3,
        pageType: 'blockedCases',
      },
      state: {
        trialLocationPage: {
          blockedCases: 0,
          eligibleCases: 0,
        },
      },
    });

    expect(result.state.trialLocationPage.blockedCases).toBe(3);
  });

  it('should default to 0 if props.pageNumber is not provided', async () => {
    const result = await runAction(setTrialLocationPaginationAction, {
      props: {
        pageType: 'eligibleCases',
      },
      state: {
        trialLocationPage: {
          blockedCases: 0,
          eligibleCases: 5,
        },
      },
    });

    expect(result.state.trialLocationPage.eligibleCases).toBe(0);
  });
});
