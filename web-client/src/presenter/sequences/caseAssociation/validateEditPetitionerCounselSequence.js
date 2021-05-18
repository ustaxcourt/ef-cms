import { clearAlertsAction } from '../../actions/clearAlertsAction';
import { setRepresentingFromRepresentingMapActionFactory } from '../../actions/setRepresentingFromRepresentingMapActionFactory';
import { setValidationErrorsAction } from '../../actions/setValidationErrorsAction';
import { shouldValidateAction } from '../../actions/shouldValidateAction';
import { validateEditPetitionerCounselAction } from '../../actions/caseAssociation/validateEditPetitionerCounselAction';

export const validateEditPetitionerCounselSequence = [
  shouldValidateAction,
  {
    ignore: [],
    validate: [
      setRepresentingFromRepresentingMapActionFactory('form'),
      validateEditPetitionerCounselAction,
      {
        error: [setValidationErrorsAction],
        success: [clearAlertsAction],
      },
    ],
  },
];
