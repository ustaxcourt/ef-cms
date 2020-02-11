import { canUnconsolidateAction } from '../actions/caseConsolidation/canUnconsolidateAction';
import { clearModalAction } from '../actions/clearModalAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { getConsolidatedCasesByCaseAction } from '../actions/caseConsolidation/getConsolidatedCasesByCaseAction';
import { refreshCaseAction } from '../actions/refreshCaseAction';
import { removeConsolidatedCasesAction } from '../actions/caseConsolidation/removeConsolidatedCasesAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setConsolidatedCasesForCaseAction } from '../actions/caseConsolidation/setConsolidatedCasesForCaseAction';
import { setModalErrorAction } from '../actions/setModalErrorAction';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';

export const submitRemoveConsolidatedCasesSequence = [
  canUnconsolidateAction,
  {
    error: [setModalErrorAction],
    success: showProgressSequenceDecorator([
      removeConsolidatedCasesAction,
      refreshCaseAction,
      getConsolidatedCasesByCaseAction,
      setConsolidatedCasesForCaseAction,
      clearModalAction,
      clearModalStateAction,
      setAlertSuccessAction,
    ]),
  },
];
