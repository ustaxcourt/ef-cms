import { clearModalAction } from '../actions/clearModalAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { getConsolidatedCasesByCaseAction } from '../actions/CaseConsolidation/getConsolidatedCasesByCaseAction';
import { removeCaseFromTrialAction } from '../actions/CaseDetail/removeCaseFromTrialAction';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setConsolidatedCasesForCaseAction } from '../actions/CaseConsolidation/setConsolidatedCasesForCaseAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { validateRemoveFromTrialSessionAction } from '../actions/CaseDetail/validateRemoveFromTrialSessionAction';

export const removeCaseFromTrialSequence = [
  startShowValidationAction,
  validateRemoveFromTrialSessionAction,
  {
    error: [setValidationErrorsAction],
    success: showProgressSequenceDecorator([
      removeCaseFromTrialAction,
      {
        error: [setAlertErrorAction, clearModalAction, clearModalStateAction],
        success: [
          setAlertSuccessAction,
          clearModalAction,
          clearModalStateAction,
          setCaseAction,
          getConsolidatedCasesByCaseAction,
          setConsolidatedCasesForCaseAction,
        ],
      },
    ]),
  },
];
