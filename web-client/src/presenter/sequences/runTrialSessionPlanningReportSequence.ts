import { runTrialSessionPlanningReportAction } from '../actions/TrialSession/runTrialSessionPlanningReportAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { setupTrialYearsAction } from '@web-client/presenter/actions/setupTrialYearsAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { validateTrialSessionPlanningAction } from '../actions/validateTrialSessionPlanningAction';

export const runTrialSessionPlanningReportSequence = [
  startShowValidationAction,
  setupTrialYearsAction,
  validateTrialSessionPlanningAction,
  {
    error: [setValidationErrorsAction],
    success: showProgressSequenceDecorator([
      runTrialSessionPlanningReportAction,
    ]),
  },
] as unknown as (props: { term: string; year: string }) => void;
