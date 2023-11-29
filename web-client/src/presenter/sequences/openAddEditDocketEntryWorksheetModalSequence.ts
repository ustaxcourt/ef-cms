import { clearFormAction } from '@web-client/presenter/actions/clearFormAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { setAddEditDocketEntryWorksheetModalStateAction } from '@web-client/presenter/actions/PendingMotion/setAddEditDocketEntryWorksheetModalStateAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';

export const openAddEditDocketEntryWorksheetModalSequence = [
  clearModalStateAction,
  clearFormAction,
  setAddEditDocketEntryWorksheetModalStateAction,
  setShowModalFactoryAction('AddEditDocketEntryWorksheetModal'),
];
