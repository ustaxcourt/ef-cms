import { clearModalStateAction } from '../actions/clearModalStateAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { getSetJudgesSequence } from './getSetJudgesSequence';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';

export const openCaseInventoryReportModalSequence =
  showProgressSequenceDecorator([
    clearModalStateAction,
    clearScreenMetadataAction,
    getSetJudgesSequence,
    setShowModalFactoryAction('CaseInventoryReportModal'),
  ]);
