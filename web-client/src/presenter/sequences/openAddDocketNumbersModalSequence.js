import { clearModalStateAction } from '../actions/clearModalStateAction';
import { hasAlreadyAddedDocketNumbersAction } from '../actions/CaseConsolidation/hasAlreadyAddedDocketNumbersAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';
import { setupConsolidatedCasesAction } from '../actions/CaseConsolidation/setupConsolidatedCasesAction';
import { setupConsolidatedCasesForAddedDocketNumbersAction } from '../actions/CaseConsolidation/setupConsolidatedCasesForAddedDocketNumbersAction';

export const openAddDocketNumbersModalSequence = [
  clearModalStateAction,
  hasAlreadyAddedDocketNumbersAction,
  {
    no: [setupConsolidatedCasesAction],
    yes: [setupConsolidatedCasesForAddedDocketNumbersAction],
  },
  setShowModalFactoryAction('AddDocketNumbersModal'),
];
