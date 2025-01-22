import { checkForExistingMinuteSheetAction } from '@web-client/presenter/actions/TrialSessionMinutes/checkForExistingMinuteSheetAction';
import { clearMinuteSheetFormStateAction } from '@web-client/presenter/actions/TrialSessionMinutes/clearMinuteSheetFormState';
import { getCaseAction } from '@web-client/presenter/actions/getCaseAction';
import { getJudgeFullNameAction } from '@web-client/presenter/actions/TrialSessionMinutes/getJudgeFullNameAction';
import { getTrialSessionDetailsAction } from '../../actions/TrialSession/getTrialSessionDetailsAction';
import { initializeTrialSessionMinuteSheetFormAction } from '@web-client/presenter/actions/TrialSessionMinutes/initializeTrialSessionMinuteSheetFormAction';
import { parallel } from 'cerebral/factories';
import { saveMinuteSheetFormSnapshotAction } from '@web-client/presenter/actions/TrialSessionMinutes/saveMinuteSheetFormSnapshotAction';
import { setCaseAction } from '@web-client/presenter/actions/setCaseAction';
import { setExistingMinuteSheetFormAction } from '@web-client/presenter/actions/TrialSessionMinutes/setExistingMinuteSheetFormAction';
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
  getJudgeFullNameAction,
  clearMinuteSheetFormStateAction,
  checkForExistingMinuteSheetAction,
  {
    no: [initializeTrialSessionMinuteSheetFormAction],
    yes: [setExistingMinuteSheetFormAction],
  },
  saveMinuteSheetFormSnapshotAction,
  setupCurrentPageAction('TrialSessionMinutesPage'),
] as unknown as ({
  docketNumber,
  trialSessionId,
}: {
  trialSessionId: string;
  docketNumber: string;
}) => void;
