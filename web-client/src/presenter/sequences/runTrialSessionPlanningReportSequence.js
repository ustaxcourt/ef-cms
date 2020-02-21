import { clearModalAction } from '../actions/clearModalAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { runTrialSessionPlanningReportAction } from '../actions/TrialSession/runTrialSessionPlanningReportAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setPdfPreviewUrlSequence } from './setPdfPreviewUrlSequence';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { validateTrialSessionPlanningAction } from '../actions/validateTrialSessionPlanningAction';

export const runTrialSessionPlanningReportSequence = [
  startShowValidationAction,
  validateTrialSessionPlanningAction,
  {
    error: [setValidationErrorsAction],
    success: showProgressSequenceDecorator([
      clearModalAction,
      runTrialSessionPlanningReportAction,
      clearModalStateAction,
      ...setPdfPreviewUrlSequence,
      setCurrentPageAction('TrialSessionPlanningReport'),
      setAlertSuccessAction,
      stopShowValidationAction,
    ]),
  },
];
