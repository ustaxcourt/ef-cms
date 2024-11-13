import { PublicClientState } from '@web-client/presenter/state-public';
import { PublicTrialSessionDetails } from '@web-api/business/useCases/trialSessions/getPublicTrialSessionDetailsInteractor';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setPublicTrialSessionDetailsAction } from '@web-client/presenter/actions/Public/TrialSessions/setPublicTrialSessionDetailsAction';

describe('setPublicTrialSessionDetailsAction', () => {
  it('should set the public trial session details', async () => {
    const mockTrialSession: PublicTrialSessionDetails = {
      address1: '123 Main St',
      calendaredCases: [],
      city: 'San Francisco',
      postalCode: '94535',
      startDate: '2020-11-27T05:00:00.000Z',
      state: 'CA',
      swingSessionId: '208a959f-9526-4db5-b262-e58c476a4604',
      swingSessionLocation: 'Dallas, Texas',
      trialLocation: 'Houston, Texas',
    };
    const { state } = await runAction<void, PublicClientState>(
      setPublicTrialSessionDetailsAction,
      {
        props: {
          trialSession: mockTrialSession,
        },
        state: {
          trialSessionDetailsPage: {},
        },
      },
    );

    expect(state.trialSessionDetailsPage.trialSession).toMatchObject(
      mockTrialSession,
    );
  });
});
