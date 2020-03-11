import { clearModalStateAction } from '../actions/clearModalStateAction';
import { getSetJudgesSequence } from './getSetJudgesSequence';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';

export const openCaseInventoryReportModalSequence = [
  clearModalStateAction,
  getSetJudgesSequence,
  setShowModalFactoryAction('CaseInventoryReportModal'),
];
