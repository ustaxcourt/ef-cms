import { clearAlertsAction } from '../../actions/clearAlertsAction';
import { setRepresentingFromRepresentingMapActionFactory } from '../../actions/setRepresentingFromRepresentingMapActionFactory';
import { setValidationAlertErrorsAction } from '@web-client/presenter/actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../../actions/setValidationErrorsAction';
import { shouldValidateAction } from '../../actions/shouldValidateAction';
import { validateEditPetitionerCounselAction } from '../../actions/CaseAssociation/validateEditPetitionerCounselAction';

export const validateEditPetitionerCounselSequence = [
  shouldValidateAction,
  {
    ignore: [],
    validate: [
      setRepresentingFromRepresentingMapActionFactory('form'),
      validateEditPetitionerCounselAction,
      {
        error: [setValidationErrorsAction, setValidationAlertErrorsAction],
        success: [clearAlertsAction],
      },
    ],
  },
];
