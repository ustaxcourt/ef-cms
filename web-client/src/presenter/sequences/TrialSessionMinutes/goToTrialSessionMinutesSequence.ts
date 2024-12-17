import { getCaseAction } from '@web-client/presenter/actions/getCaseAction';
import { getTrialSessionDetailsAction } from '../../actions/TrialSession/getTrialSessionDetailsAction';
import { initializeTrialSessionMinuteSheetFormAction } from '@web-client/presenter/actions/TrialSessionMinutes/initializeTrialSessionMinuteSheetFormAction';
import { parallel } from 'cerebral/factories';
import { setCaseAction } from '@web-client/presenter/actions/setCaseAction';
import { setTrialSessionDetailsAction } from '../../actions/TrialSession/setTrialSessionDetailsAction';
import { setTrialSessionIdAction } from '../../actions/TrialSession/setTrialSessionIdAction';
import { setupCurrentPageAction } from '../../actions/setupCurrentPageAction';

export const goToTrialSessionMinutesSequence = [
  setupCurrentPageAction('Interstitial'),
  setTrialSessionIdAction,
  parallel([
    [getTrialSessionDetailsAction, setTrialSessionDetailsAction],
    [getCaseAction, setCaseAction],
  ]),
  initializeTrialSessionMinuteSheetFormAction,
  setupCurrentPageAction('TrialSessionMinutesPage'),
] as unknown as ({
  docketNumber,
  trialSessionId,
}: {
  trialSessionId: string;
  docketNumber: string;
}) => void;
