import { clearAlertsAction } from '../actions/clearAlertsAction';
import { setFilersFromFilersMapAction } from '../actions/setFilersFromFilersMapAction';
import { setValidationAlertErrorsAction } from '@web-client/presenter/actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { shouldValidateAction } from '../actions/shouldValidateAction';
import { validateDocketEntryAction } from '../actions/DocketEntry/validateDocketEntryAction';

export const validateDocketEntrySequence = [
  shouldValidateAction,
  {
    ignore: [],
    validate: [
      setFilersFromFilersMapAction,
      validateDocketEntryAction,
      {
        error: [setValidationErrorsAction, setValidationAlertErrorsAction],
        success: [clearAlertsAction],
      },
    ],
  },
];
