import { clearFormAction } from '@web-client/presenter/actions/clearFormAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { setAddEditCaseWorksheetModalStateAction } from '@web-client/presenter/actions/CaseWorksheet/setAddEditCaseWorksheetModalStateAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';

export const openAddEditCaseWorksheetModalSequence = [
  clearModalStateAction,
  clearFormAction,
  setAddEditCaseWorksheetModalStateAction,
  setShowModalFactoryAction('AddEditCaseWorksheetModal'),
];
