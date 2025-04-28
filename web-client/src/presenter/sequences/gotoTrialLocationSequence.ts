import { getBlockedCasesByTrialLocationAction } from '@web-client/presenter/actions/CaseDetail/getBlockedCasesByTrialLocationAction';
import { getEligibleCasesForLocationAction } from '@web-client/presenter/actions/TrialSession/getEligibleCasesForLocationAction';
import { getFormattedTrialLocationAction } from '@web-client/presenter/actions/CaseDetail/getFormattedTrialLocationAction';
import { parallel } from 'cerebral/factories';
import { setBlockedCasesAction } from '@web-client/presenter/actions/CaseDetail/setBlockedCasesAction';
import { setEligibleCasesForLocationAction } from '@web-client/presenter/actions/TrialSession/setEligibleCasesForLocationAction';
import { setupCurrentPageAction } from '../actions/setupCurrentPageAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';
import { setPropsForTrialLocationAction } from '@web-client/presenter/actions/TrialSession/setPropsForTrialLocationAction';
import { setRedirectUrlAction } from '@web-client/presenter/actions/setRedirectUrlAction';

export const gotoTrialLocationSequence =
  startWebSocketConnectionSequenceDecorator([
    setupCurrentPageAction('Interstitial'),
    setPropsForTrialLocationAction,
    setRedirectUrlAction,
    parallel([
      [getEligibleCasesForLocationAction, setEligibleCasesForLocationAction],
      [
        getFormattedTrialLocationAction,
        getBlockedCasesByTrialLocationAction,
        setBlockedCasesAction,
      ],
    ]),
    setupCurrentPageAction('TrialLocation'),
  ]) as unknown as (props: ActionProps<{ trialLocation: string }>) => void;
