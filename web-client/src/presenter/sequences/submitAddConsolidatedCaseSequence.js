import { addConsolidatedCaseAction } from '../actions/caseConsolidation/addConsolidatedCaseAction';
import { canConsolidateAction } from '../actions/caseConsolidation/canConsolidateAction';
import { clearModalAction } from '../actions/clearModalAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { getConsolidatedCasesByCaseAction } from '../actions/caseConsolidation/getConsolidatedCasesByCaseAction';
import { primePropsForCanConsolidateAction } from '../actions/caseConsolidation/primePropsForCanConsolidateAction';
import { setAddConsolidatedCaseSuccessMessageAction } from '../actions/caseConsolidation/setAddConsolidatedCaseSuccessMessageAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCanConsolidateErrorAction } from '../actions/caseConsolidation/setCanConsolidateErrorAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setConsolidatedCasesForCaseAction } from '../actions/caseConsolidation/setConsolidatedCasesForCaseAction';
import { setWaitingForResponseAction } from '../actions/setWaitingForResponseAction';
import { unsetWaitingForResponseAction } from '../actions/unsetWaitingForResponseAction';

export const submitAddConsolidatedCaseSequence = [
  primePropsForCanConsolidateAction,
  canConsolidateAction,
  {
    error: [setCanConsolidateErrorAction],
    success: [
      setWaitingForResponseAction,
      addConsolidatedCaseAction,
      setCaseAction,
      getConsolidatedCasesByCaseAction,
      setConsolidatedCasesForCaseAction,
      clearModalAction,
      clearModalStateAction,
      setAddConsolidatedCaseSuccessMessageAction,
      setAlertSuccessAction,
      unsetWaitingForResponseAction,
    ],
  },
];
