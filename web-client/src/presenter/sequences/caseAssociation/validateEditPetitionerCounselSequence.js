import { clearAlertsAction } from '../../actions/clearAlertsAction';
import { setFilersFromFilersMapAction } from '../../actions/setFilersFromFilersMapAction';
import { setValidationErrorsAction } from '../../actions/setValidationErrorsAction';
import { shouldValidateAction } from '../../actions/shouldValidateAction';
import { validateEditPetitionerCounselAction } from '../../actions/caseAssociation/validateEditPetitionerCounselAction';

export const validateEditPetitionerCounselSequence = [
  shouldValidateAction,
  {
    ignore: [],
    validate: [
      setFilersFromFilersMapAction,
      validateEditPetitionerCounselAction,
      {
        error: [setValidationErrorsAction],
        success: [clearAlertsAction],
      },
    ],
  },
];
