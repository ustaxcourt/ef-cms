import { clearModalAction } from '@web-client/presenter/actions/clearModalAction';
import { navigateToTrialSessionPlanningReportViewAction } from '../actions/navigateToTrialSessionPlanningReportViewAction';
import { setValidationErrorsAction } from '@web-client/presenter/actions/setValidationErrorsAction';
import { showProgressSequenceDecorator } from '@web-client/presenter/utilities/showProgressSequenceDecorator';
import { startShowValidationAction } from '@web-client/presenter/actions/startShowValidationAction';
import { stopShowValidationAction } from '@web-client/presenter/actions/stopShowValidationAction';
import { validateTrialSessionPlanningAction } from '@web-client/presenter/actions/validateTrialSessionPlanningAction';

export const navigateToTrialSessionPlanningReportSequence = [
  startShowValidationAction,
  validateTrialSessionPlanningAction,
  {
    error: [setValidationErrorsAction],
    success: showProgressSequenceDecorator([
      navigateToTrialSessionPlanningReportViewAction,
      clearModalAction,
      stopShowValidationAction,
    ]),
  },
] as unknown as (props: { term: string; year: number }) => void;
