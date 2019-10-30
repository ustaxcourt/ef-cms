import { clearAlertsAction } from '../actions/clearAlertsAction';
import { setValidationErrorsByFlagAction } from '../actions/WorkItem/setValidationErrorsByFlagAction';
import { shouldValidateAction } from '../actions/shouldValidateAction';
import { updateWorkItemFromPropsOrModalOrFormAction } from '../actions/WorkItem/updateWorkItemFromPropsOrModalOrFormAction';
import { validateInitialWorkItemMessageAction } from '../actions/validateInitialWorkItemMessageAction';

export const validateInitialWorkItemMessageSequence = [
  shouldValidateAction,
  {
    ignore: [],
    validate: [
      updateWorkItemFromPropsOrModalOrFormAction,
      validateInitialWorkItemMessageAction,
      {
        error: [setValidationErrorsByFlagAction],
        success: [clearAlertsAction],
      },
    ],
  },
];
