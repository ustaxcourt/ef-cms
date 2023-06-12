import { clearModalAction } from '../../actions/clearModalAction';
import { getCaseAction } from '../../actions/getCaseAction';
import { getConsolidatedCasesByCaseAction } from '../../actions/CaseConsolidation/getConsolidatedCasesByCaseAction';
import { parallel } from 'cerebral';
import { setCaseAction } from '../../actions/setCaseAction';
import { setConsolidatedCasesForCaseAction } from '../../actions/CaseConsolidation/setConsolidatedCasesForCaseAction';
import { showProgressSequenceDecorator } from '../../utilities/showProgressSequenceDecorator';

export const closeModalAndRefetchCase = showProgressSequenceDecorator([
  clearModalAction,
  parallel([getCaseAction, getConsolidatedCasesByCaseAction]),
  setCaseAction,
  setConsolidatedCasesForCaseAction,
]);
