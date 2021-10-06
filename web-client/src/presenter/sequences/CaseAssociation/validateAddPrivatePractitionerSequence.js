import { clearAlertsAction } from '../../actions/clearAlertsAction';
import { setRepresentingFromRepresentingMapActionFactory } from '../../actions/setRepresentingFromRepresentingMapActionFactory';
import { setValidationErrorsAction } from '../../actions/setValidationErrorsAction';
import { shouldValidateAction } from '../../actions/shouldValidateAction';
import { validateAddPrivatePractitionerAction } from '../../actions/caseAssociation/validateAddPrivatePractitionerAction';

export const validateAddPrivatePractitionerSequence = [
  shouldValidateAction,
  {
    ignore: [],
    validate: [
      setRepresentingFromRepresentingMapActionFactory('modal'),
      validateAddPrivatePractitionerAction,
      {
        error: [setValidationErrorsAction],
        success: [clearAlertsAction],
      },
    ],
  },
];
