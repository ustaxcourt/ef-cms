import { clearModalStateAction } from '../actions/clearModalStateAction';
import { getConsolidatedCasesByCaseAction } from '../actions/CaseConsolidation/getConsolidatedCasesByCaseAction';
import { setConsolidatedCasesForCaseAction } from '../actions/CaseConsolidation/setConsolidatedCasesForCaseAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';
import { setupConsolidatedCasesAction } from '../actions/CaseConsolidation/setupConsolidatedCasesAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';

export const openAddDocketNumbersModalSequence = [
  clearModalStateAction,
  showProgressSequenceDecorator([
    getConsolidatedCasesByCaseAction,
    setConsolidatedCasesForCaseAction,
  ]),
  setupConsolidatedCasesAction,
  setShowModalFactoryAction('AddDocketNumbersModal'),
];
