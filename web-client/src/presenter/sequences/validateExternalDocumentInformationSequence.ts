import { clearAlertsAction } from '../actions/clearAlertsAction';
import { setFilersFromFilersMapAction } from '../actions/setFilersFromFilersMapAction';
import { setValidationAlertErrorsAction } from '@web-client/presenter/actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { shouldValidateAction } from '../actions/shouldValidateAction';
import { validateExternalDocumentInformationAction } from '../actions/FileDocument/validateExternalDocumentInformationAction';

export const validateExternalDocumentInformationSequence = [
  shouldValidateAction,
  {
    ignore: [],
    validate: [
      setFilersFromFilersMapAction,
      validateExternalDocumentInformationAction,
      {
        error: [setValidationErrorsAction, setValidationAlertErrorsAction],
        success: [clearAlertsAction],
      },
    ],
  },
];
