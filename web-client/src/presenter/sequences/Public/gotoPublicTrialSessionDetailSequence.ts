import { getPublicTrialSessionDetailsAction } from '@web-client/presenter/actions/TrialSession/getPublicTrialSessionDetailsAction';
import { setTrialSessionDetailsAction } from '@web-client/presenter/actions/TrialSession/setTrialSessionDetailsAction';
import { setupCurrentPageAction } from '@web-client/presenter/actions/setupCurrentPageAction';

export const gotoPublicTrialSessionDetailSequence = [
  setupCurrentPageAction('Interstitial'),
  getPublicTrialSessionDetailsAction,
  setTrialSessionDetailsAction,
  setupCurrentPageAction('PublicTrialSessionDetail'),
] as unknown as (props: { trialSessionId: string }) => void;
