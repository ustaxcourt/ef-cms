import { clearModalAction } from '../actions/clearModalAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { navigateToTrialSessionPlanningReportAction } from '../actions/navigateToTrialSessionPlanningReportAction';
import { runTrialSessionPlanningReportAction } from '../actions/TrialSession/runTrialSessionPlanningReportAction';
import { setPdfPreviewUrlSequence } from './setPdfPreviewUrlSequence';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';
import { startShowValidationAction } from '../actions/startShowValidationAction';
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
      setPdfPreviewUrlSequence,
      navigateToTrialSessionPlanningReportAction,
    ]),
  },
];
