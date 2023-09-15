import { clearModalStateAction } from '../actions/clearModalStateAction';
import { setDeletePrimaryIssueModalStateAction } from '@web-client/presenter/actions/CaseWorksheet/setDeletePrimaryIssueModalStateAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';

export const openDeletePrimaryIssueSequence = [
  clearModalStateAction,
  setDeletePrimaryIssueModalStateAction,
  setShowModalFactoryAction('DeletePrimaryIssueModal'),
];
