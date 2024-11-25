import { getCaseAction } from '@web-client/presenter/actions/getCaseAction';
import { getTrialSessionDetailsAction } from '../../actions/TrialSession/getTrialSessionDetailsAction';
import { parallel } from 'cerebral/factories';
import { setCaseAction } from '@web-client/presenter/actions/setCaseAction';
import { setTrialSessionDetailsAction } from '../../actions/TrialSession/setTrialSessionDetailsAction';
import { setTrialSessionIdAction } from '../../actions/TrialSession/setTrialSessionIdAction';
import { setupCurrentPageAction } from '../../actions/setupCurrentPageAction';

export const goToTrialSessionMinutesSequence = [
  setupCurrentPageAction('Interstitial'),
  setTrialSessionIdAction,
  parallel([
    [
      getTrialSessionDetailsAction,
      setTrialSessionDetailsAction,
      getCaseAction,
      setCaseAction,
    ],
  ]),
  setupCurrentPageAction('TrialSessionMinutesPage'),
] as unknown as (props: {
  trialSessionId: string;
  docketNumber: string;
}) => void;
