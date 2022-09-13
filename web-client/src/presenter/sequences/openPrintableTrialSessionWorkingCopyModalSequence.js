import { clearModalStateAction } from '../actions/clearModalStateAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';

export const openPrintableTrialSessionWorkingCopyModalSequence = [
  clearModalStateAction,
  //   setupTrialYearsAction,
  setShowModalFactoryAction('PrintableTrialSessionWorkingCopyModal'),
];
