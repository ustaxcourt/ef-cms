import { canUnconsolidateAction } from '../actions/CaseConsolidation/canUnconsolidateAction';
import { clearModalAction } from '../actions/clearModalAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { removeConsolidatedCasesAction } from '../actions/CaseConsolidation/removeConsolidatedCasesAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setModalErrorAction } from '../actions/setModalErrorAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';
import { getCaseAction } from '@web-client/presenter/actions/getCaseAction';
import { setCaseAction } from '@web-client/presenter/actions/setCaseAction';

export const submitRemoveConsolidatedCasesSequence = [
  canUnconsolidateAction,
  {
    error: [setModalErrorAction],
    success: showProgressSequenceDecorator([
      removeConsolidatedCasesAction,
      getCaseAction,
      setCaseAction,
      clearModalAction,
      clearModalStateAction,
      setAlertSuccessAction,
    ]),
  },
];
