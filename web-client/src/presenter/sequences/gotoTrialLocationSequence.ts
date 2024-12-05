import { getEligibleCasesForLocationAction } from '@web-client/presenter/actions/TrialSession/getEligibleCasesForLocationAction';
import { setEligibleCasesForLocationAction } from '@web-client/presenter/actions/TrialSession/setEligibleCasesForLocationAction';
import { setLocationForTrialLocationAction } from '@web-client/presenter/actions/TrialSession/setLocationForTrialLocationAction';
import { setupCurrentPageAction } from '../actions/setupCurrentPageAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';

export const gotoTrialLocationSequence =
  startWebSocketConnectionSequenceDecorator([
    setupCurrentPageAction('Interstitial'),
    setLocationForTrialLocationAction,
    getEligibleCasesForLocationAction,
    setEligibleCasesForLocationAction,
    setupCurrentPageAction('TrialLocation'),
  ]) as unknown as (props: ActionProps<{ trialLocation: string }>) => void;
