import { runTrialSessionPlanningReportAction } from '../actions/TrialSession/runTrialSessionPlanningReportAction';
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
      runTrialSessionPlanningReportAction,
    ]),
  },
] as unknown as (props: { term: string; year: number }) => void;
