import { PublicClientState } from '@web-client/presenter/state-public';
import { PublicTrialSessionDetails } from '@web-api/business/useCases/trialSessions/getPublicTrialSessionDetailsInteractor';
import {
  SESSION_STATUS_TYPES,
  SESSION_TYPES,
} from '@shared/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { getPublicTrialSessionDetailsAction } from '@web-client/presenter/actions/Public/TrialSessions/getPublicTrialSessionDetailsAction';
import { presenter } from '@web-client/presenter/presenter-public';
import { runAction } from 'cerebral/test';

describe('getPublicTrialSessionDetailsAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });
  it('should get the correct trial session details', async () => {
    const mockTrialSession: PublicTrialSessionDetails = {
      address1: '123 Main St',
      calendaredCases: [],
      city: 'San Francisco',
      estimatedEndDate: '2020-11-29T05:00:00.000Z',
      isSwingSession: true,
      postalCode: '94535',
      sessionStatus: SESSION_STATUS_TYPES.open,
      sessionType: SESSION_TYPES.regular,
      startDate: '2020-11-27T05:00:00.000Z',
      state: 'CA',
      swingSessionId: '208a959f-9526-4db5-b262-e58c476a4604',
      swingSessionLocation: 'Dallas, Texas',
      term: 'Fall',
      termYear: '2020',
      trialLocation: 'Houston, Texas',
    };

    applicationContext
      .getUseCases()
      .getPublicTrialSessionDetailsInteractor.mockReturnValue(mockTrialSession);

    const { output } = await runAction<
      { trialSession: PublicTrialSessionDetails },
      PublicClientState
      // @ts-ignore
    >(getPublicTrialSessionDetailsAction, {
      modules: {
        presenter,
      },
    });

    // @ts-ignore
    expect(output.trialSession).toMatchObject(mockTrialSession);
  });
});
