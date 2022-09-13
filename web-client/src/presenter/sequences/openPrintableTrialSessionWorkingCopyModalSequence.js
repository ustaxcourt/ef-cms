import { clearModalStateAction } from '../actions/clearModalStateAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';
import { state } from 'cerebral';

const setCaseNotesFlagDefaultAction = ({ store }) => {
  store.set(state.modal['caseNotesFlag'], true);
};

export const openPrintableTrialSessionWorkingCopyModalSequence = [
  clearModalStateAction,
  setCaseNotesFlagDefaultAction,
  setShowModalFactoryAction('PrintableTrialSessionWorkingCopyModal'),
];
