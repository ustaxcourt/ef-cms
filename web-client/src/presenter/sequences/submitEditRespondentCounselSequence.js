import { clearFormAction } from '../actions/clearFormAction';
import { clearModalAction } from '../actions/clearModalAction';
import { getCaseAction } from '../actions/getCaseAction';
import { navigateToCaseDetailCaseInformationActionFactory } from '../actions/navigateToCaseDetailCaseInformationActionFactory';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setCasePropFromStateAction } from '../actions/setCasePropFromStateAction';
import { setValidationAlertErrorsAction } from '../actions/setValidationAlertErrorsAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { submitEditRespondentCounselAction } from '../actions/CaseAssociation/submitEditRespondentCounselAction';
import { validateEditRespondentCounselAction } from '../actions/CaseAssociation/validateEditRespondentCounselAction';

export const submitEditRespondentCounselSequence = [
  startShowValidationAction,
  validateEditRespondentCounselAction,
  {
    error: [setValidationAlertErrorsAction],
    success: showProgressSequenceDecorator([
      submitEditRespondentCounselAction,
      {
        success: [
          setAlertSuccessAction,
          clearModalAction,
          clearFormAction,
          setCasePropFromStateAction,
          getCaseAction,
          setCaseAction,
          navigateToCaseDetailCaseInformationActionFactory('parties'),
        ],
      },
    ]),
  },
];
