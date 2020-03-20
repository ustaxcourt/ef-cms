import { clearModalStateAction } from '../actions/clearModalStateAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { getSetJudgesSequence } from './getSetJudgesSequence';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';

export const openCaseInventoryReportModalSequence = [
  clearModalStateAction,
  clearScreenMetadataAction,
  getSetJudgesSequence,
  setShowModalFactoryAction('CaseInventoryReportModal'),
];
