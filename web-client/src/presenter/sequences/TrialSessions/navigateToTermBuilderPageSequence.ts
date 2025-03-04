import { clearModalAction } from '@web-client/presenter/actions/clearModalAction';
import { setValidationErrorsAction } from '@web-client/presenter/actions/setValidationErrorsAction';
import { startShowValidationAction } from '@web-client/presenter/actions/startShowValidationAction';
import { navigateToTermBuilderPageAction } from '@web-client/presenter/actions/TrialSession/TermBuilder/navigateToTermBuilderPageAction';
import { saveTermBuilderInfoAction } from '@web-client/presenter/actions/TrialSession/TermBuilder/saveTermBuilderInfoAction';
import { validateCreateTermModalAction } from '@web-client/presenter/actions/TrialSession/validateCreateTermModalAction';

export const navigateToTermBuilderPageSequence = [
  startShowValidationAction,
  validateCreateTermModalAction,
  {
    success: [
      clearModalAction,
      saveTermBuilderInfoAction,
      navigateToTermBuilderPageAction,
    ],
    error: [setValidationErrorsAction],
  },
] as unknown as Function;
