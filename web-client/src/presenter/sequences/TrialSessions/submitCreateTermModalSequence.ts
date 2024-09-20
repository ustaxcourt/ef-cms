import { clearModalAction } from '@web-client/presenter/actions/clearModalAction';
import { clearModalStateAction } from '@web-client/presenter/actions/clearModalStateAction';
import { runCreateTermAction } from '@web-client/presenter/actions/TrialSession/runCreateTermAction';
import { setValidationErrorsAction } from '@web-client/presenter/actions/setValidationErrorsAction';
import { showProgressSequenceDecorator } from '@web-client/presenter/utilities/showProgressSequenceDecorator';
import { startShowValidationAction } from '@web-client/presenter/actions/startShowValidationAction';
import { validateCreateTermModalAction } from '@web-client/presenter/actions/TrialSession/validateCreateTermModalAction';

export const submitCreateTermModalSequence = [
  startShowValidationAction,
  validateCreateTermModalAction,
  {
    error: [setValidationErrorsAction],
    success: showProgressSequenceDecorator([
      clearModalAction,
      runCreateTermAction,
      clearModalStateAction,
      //setPdfPreviewUrlSequence,
      //navigateToTrialSessionPlanningReportAction,
    ]),
  },
];
