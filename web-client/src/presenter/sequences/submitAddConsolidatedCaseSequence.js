import { addConsolidatedCaseAction } from '../actions/caseConsolidation/addConsolidatedCaseAction';
import { canConsolidateAction } from '../actions/caseConsolidation/canConsolidateAction';
import { clearModalAction } from '../actions/clearModalAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { getConsolidatedCasesByCaseAction } from '../actions/caseConsolidation/getConsolidatedCasesByCaseAction';
import { primePropsForCanConsolidateAction } from '../actions/caseConsolidation/primePropsForCanConsolidateAction';
import { refreshCaseAction } from '../actions/refreshCaseAction';
import { setAddConsolidatedCaseSuccessMessageAction } from '../actions/caseConsolidation/setAddConsolidatedCaseSuccessMessageAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setConsolidatedCasesForCaseAction } from '../actions/caseConsolidation/setConsolidatedCasesForCaseAction';
import { setModalErrorAction } from '../actions/setModalErrorAction';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';

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
