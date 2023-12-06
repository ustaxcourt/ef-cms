import { clearModalStateAction } from '../actions/clearModalStateAction';
import { setMultiDocketingCheckboxesAction } from '../actions/CaseConsolidation/setMultiDocketingCheckboxesAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';

export const openAddDocketNumbersModalSequence = [
  clearModalStateAction,
  setMultiDocketingCheckboxesAction,
  setShowModalFactoryAction('AddDocketNumbersModal'),
];
