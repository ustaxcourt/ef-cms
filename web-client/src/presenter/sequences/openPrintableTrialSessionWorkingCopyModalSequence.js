import { clearModalStateAction } from '../actions/clearModalStateAction';

import { setShowCaseNotesDefaultAction } from '../actions/TrialSessionWorkingCopy/setShowCaseNotesDefaultAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';

export const openPrintableTrialSessionWorkingCopyModalSequence = [
  clearModalStateAction,
  setShowCaseNotesDefaultAction,
  setShowModalFactoryAction('PrintableTrialSessionWorkingCopyModal'),
];
