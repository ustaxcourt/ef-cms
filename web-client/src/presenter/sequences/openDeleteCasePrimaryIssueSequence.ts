import { clearModalStateAction } from '../actions/clearModalStateAction';
import { setOpenDeleteCasePrimaryIssueModalStateAction } from '../actions/CaseWorksheet/setOpenDeleteCasePrimaryIssueModalStateAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';

export const openDeleteCasePrimaryIssueSequence = [
  clearModalStateAction,
  setOpenDeleteCasePrimaryIssueModalStateAction,
  setShowModalFactoryAction('DeletePrimaryIssueModal'),
];
