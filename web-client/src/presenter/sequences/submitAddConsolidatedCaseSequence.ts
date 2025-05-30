import { addConsolidatedCaseAction } from '../actions/CaseConsolidation/addConsolidatedCaseAction';
import { canConsolidateAction } from '../actions/CaseConsolidation/canConsolidateAction';
import { clearModalAction } from '../actions/clearModalAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { primePropsForCanConsolidateAction } from '../actions/CaseConsolidation/primePropsForCanConsolidateAction';
import { setAddConsolidatedCaseSuccessMessageAction } from '../actions/CaseConsolidation/setAddConsolidatedCaseSuccessMessageAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setModalErrorAction } from '../actions/setModalErrorAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';
import { getCaseAction } from '@web-client/presenter/actions/getCaseAction';
import { setCaseAction } from '@web-client/presenter/actions/setCaseAction';

export const submitAddConsolidatedCaseSequence = [
  primePropsForCanConsolidateAction,
  canConsolidateAction,
  {
    error: [setModalErrorAction],
    success: showProgressSequenceDecorator([
      addConsolidatedCaseAction,
      getCaseAction,
      setCaseAction,
      clearModalAction,
      clearModalStateAction,
      setAddConsolidatedCaseSuccessMessageAction,
      setAlertSuccessAction,
    ]),
  },
];
