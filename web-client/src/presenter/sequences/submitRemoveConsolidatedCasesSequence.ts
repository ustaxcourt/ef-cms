import { canUnconsolidateAction } from '../actions/CaseConsolidation/canUnconsolidateAction';
import { clearModalAction } from '../actions/clearModalAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { refreshCaseAction } from '../actions/refreshCaseAction';
import { removeConsolidatedCasesAction } from '../actions/CaseConsolidation/removeConsolidatedCasesAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setModalErrorAction } from '../actions/setModalErrorAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';

export const submitRemoveConsolidatedCasesSequence = [
  canUnconsolidateAction,
  {
    error: [setModalErrorAction],
    success: showProgressSequenceDecorator([
      removeConsolidatedCasesAction,
      refreshCaseAction,
      clearModalAction,
      clearModalStateAction,
      setAlertSuccessAction,
    ]),
  },
];
