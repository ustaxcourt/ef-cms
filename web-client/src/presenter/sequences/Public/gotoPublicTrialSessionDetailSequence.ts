import { getPublicTrialSessionDetailsAction } from '@web-client/presenter/actions/TrialSession/getPublicTrialSessionDetailsAction';
import { setPublicTrialSessionDetailAction } from '@web-client/presenter/actions/Public/setPublicTrialSessionDetailAction';
import { setupCurrentPageAction } from '@web-client/presenter/actions/setupCurrentPageAction';

export const gotoPublicTrialSessionDetailSequence = [
  setupCurrentPageAction('Interstitial'),
  getPublicTrialSessionDetailsAction,
  setPublicTrialSessionDetailAction,
  setupCurrentPageAction('PublicTrialSessionDetail'),
] as unknown as (props: { trialSessionId: string }) => void;
