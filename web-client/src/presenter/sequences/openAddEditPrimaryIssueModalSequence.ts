import { clearModalStateAction } from '../actions/clearModalStateAction';
import { setAddEditPrimaryIssueModalStateAction } from '../actions/CaseWorksheet/setAddEditPrimaryIssueModalStateAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';

export const openAddEditPrimaryIssueModalSequence = [
  clearModalStateAction,
  setAddEditPrimaryIssueModalStateAction,
  setShowModalFactoryAction('AddEditPrimaryIssueModal'),
];
