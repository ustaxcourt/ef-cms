import { clearModalAction } from '@web-client/presenter/actions/clearModalAction';
import { clearModalStateAction } from '@web-client/presenter/actions/clearModalStateAction';
import { downloadXlsxAction } from '@web-client/presenter/actions/downloadXlsxAction';
import { runCreateTermAction } from '@web-client/presenter/actions/TrialSession/runCreateTermAction';
import { setAlertErrorAction } from '@web-client/presenter/actions/setAlertErrorAction';
import { setAlertSuccessAction } from '@web-client/presenter/actions/setAlertSuccessAction';
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
      {
        error: [setAlertErrorAction, clearModalStateAction],
        success: [
          downloadXlsxAction,
          setAlertSuccessAction,
          clearModalStateAction,
        ],
      },
    ]),
  },
];
