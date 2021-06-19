import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearFormAction } from '../actions/clearFormAction';
import { clearModalAction } from '../actions/clearModalAction';
import { getCaseAction } from '../actions/getCaseAction';
import { navigateToCaseDetailCaseInformationActionFactory } from '../actions/navigateToCaseDetailCaseInformationActionFactory';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setCasePropFromStateAction } from '../actions/setCasePropFromStateAction';
import { setRepresentingFromRepresentingMapActionFactory } from '../actions/setRepresentingFromRepresentingMapActionFactory';
import { setValidationAlertErrorsAction } from '../actions/setValidationAlertErrorsAction';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { submitEditPetitionerCounselAction } from '../actions/caseAssociation/submitEditPetitionerCounselAction';
import { validateEditPetitionerCounselAction } from '../actions/caseAssociation/validateEditPetitionerCounselAction';

export const submitEditPetitionerCounselSequence = [
  startShowValidationAction,
  setRepresentingFromRepresentingMapActionFactory('form'),
  validateEditPetitionerCounselAction,
  {
    error: [setValidationAlertErrorsAction],
    success: showProgressSequenceDecorator([
      clearAlertsAction,
      stopShowValidationAction,
      submitEditPetitionerCounselAction,
      {
        success: [
          setAlertSuccessAction,
          clearModalAction,
          setCasePropFromStateAction,
          getCaseAction,
          setCaseAction,
          navigateToCaseDetailCaseInformationActionFactory('parties'),
          clearFormAction,
        ],
      },
    ]),
  },
];
