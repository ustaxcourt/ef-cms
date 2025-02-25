import { getPublicTrialSessionDetailsAction } from '@web-client/presenter/actions/Public/TrialSessions/getPublicTrialSessionDetailsAction';
import { setPublicTrialSessionDetailsAction } from '@web-client/presenter/actions/Public/TrialSessions/setPublicTrialSessionDetailsAction';
import { setupCurrentPageAction } from '@web-client/presenter/actions/setupCurrentPageAction';

export const gotoPublicTrialSessionDetailsSequence = [
  setupCurrentPageAction('Interstitial'),
  getPublicTrialSessionDetailsAction,
  setPublicTrialSessionDetailsAction,
  setupCurrentPageAction('PublicTrialSessionDetails'),
] as unknown as (props: { trialSessionId: string }) => void;
