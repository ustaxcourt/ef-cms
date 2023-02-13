import { addConsolidatedCaseAction } from '../actions/CaseConsolidation/addConsolidatedCaseAction';
import { canConsolidateAction } from '../actions/CaseConsolidation/canConsolidateAction';
import { clearModalAction } from '../actions/clearModalAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { getConsolidatedCasesByCaseAction } from '../actions/CaseConsolidation/getConsolidatedCasesByCaseAction';
import { primePropsForCanConsolidateAction } from '../actions/CaseConsolidation/primePropsForCanConsolidateAction';
import { refreshCaseAction } from '../actions/refreshCaseAction';
import { setAddConsolidatedCaseSuccessMessageAction } from '../actions/CaseConsolidation/setAddConsolidatedCaseSuccessMessageAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setConsolidatedCasesForCaseAction } from '../actions/CaseConsolidation/setConsolidatedCasesForCaseAction';
import { setModalErrorAction } from '../actions/setModalErrorAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';

export const submitAddConsolidatedCaseSequence = [
  primePropsForCanConsolidateAction,
  canConsolidateAction,
  {
    error: [setModalErrorAction],
    success: showProgressSequenceDecorator([
      addConsolidatedCaseAction,
      refreshCaseAction,
      getConsolidatedCasesByCaseAction,
      setConsolidatedCasesForCaseAction,
      clearModalAction,
      clearModalStateAction,
      setAddConsolidatedCaseSuccessMessageAction,
      setAlertSuccessAction,
    ]),
  },
];
