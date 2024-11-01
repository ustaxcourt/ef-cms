import { PublicTrialSessionDetails } from '@web-api/business/useCases/trialSessions/getPublicTrialSessionDetailsInteractor';
import {
  SESSION_STATUS_TYPES,
  SESSION_TYPES,
} from '@shared/business/entities/EntityConstants';
import { runAction } from 'cerebral/test';
import { setPublicTrialSessionDetailAction } from '@web-client/presenter/actions/Public/TrialSessions/setPublicTrialSessionDetailAction';

describe('setPublicTrialSessionDetailAction', () => {
  it('should set the public trial session details', async () => {
    const mockSession = {
      address1: '123 Sesame Street',
      address2: '',
      city: 'Of Blinding Lights',
      courthouseName: 'George',
      estimatedEndDate: '',
      postalCode: '12345',
      sessionStatus: SESSION_STATUS_TYPES.open,
      sessionType: SESSION_TYPES.regular,
      startDate: '',
      state: 'Missouri',
      swingSessionId: '',
      term: 'Fall',
      termYear: 'Fall 2024',
      trialLocation: 'Atlantis, MO',
    } as PublicTrialSessionDetails;
    const { state } = await runAction(setPublicTrialSessionDetailAction, {
      props: {
        trialSession: mockSession,
      },
      state: {
        trialSessionDetailsPage: {},
      },
    });

    expect(state.trialSessionDetailsPage.trialSession).toMatchObject(
      mockSession,
    );
  });
});
