import { clearModalStateAction } from '../actions/clearModalStateAction';
import { getConsolidatedCasesByCaseAction } from '../actions/CaseConsolidation/getConsolidatedCasesByCaseAction';
import { hasAlreadyAddedDocketNumbersAction } from '../actions/CaseConsolidation/hasAlreadyAddedDocketNumbersAction';
import { loadConsolidatedCasesForAddDocketNumbersModalAction } from '../actions/CaseConsolidation/loadConsolidatedCasesForAddDocketNumbersModalAction';
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
  hasAlreadyAddedDocketNumbersAction,
  {
    no: [setupConsolidatedCasesAction],
    yes: [loadConsolidatedCasesForAddDocketNumbersModalAction],
  },
  setShowModalFactoryAction('AddDocketNumbersModal'),
];
