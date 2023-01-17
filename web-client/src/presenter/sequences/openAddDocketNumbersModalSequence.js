import { clearModalStateAction } from '../actions/clearModalStateAction';
import { hasAlreadyAddedDocketNumbersAction } from '../actions/CaseConsolidation/hasAlreadyAddedDocketNumbersAction';
import { setMultiDocketingCheckboxesAction } from '../actions/CaseConsolidation/setMultiDocketingCheckboxesAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';
import { setupConsolidatedCasesForAddedDocketNumbersAction } from '../actions/CaseConsolidation/setupConsolidatedCasesForAddedDocketNumbersAction';

export const openAddDocketNumbersModalSequence = [
  clearModalStateAction,
  hasAlreadyAddedDocketNumbersAction,
  {
    no: [setMultiDocketingCheckboxesAction],
    yes: [setupConsolidatedCasesForAddedDocketNumbersAction],
  },
  setShowModalFactoryAction('AddDocketNumbersModal'),
];
