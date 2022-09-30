import { clearModalStateAction } from '../actions/clearModalStateAction';
import { setCaseNotesFlagDefaultAction } from '../actions/TrialSessionWorkingCopy/setCaseNotesFlagDefaultAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';

export const openPrintableTrialSessionWorkingCopyModalSequence = [
  clearModalStateAction,
  setCaseNotesFlagDefaultAction,
  setShowModalFactoryAction('PrintableTrialSessionWorkingCopyModal'),
];
