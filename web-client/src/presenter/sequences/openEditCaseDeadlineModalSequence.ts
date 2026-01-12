import { clearFormAction } from '../actions/clearFormAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { setCaseDeadlineFormAction } from '../actions/CaseDeadline/setCaseDeadlineFormAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';
import { setTodaysDateAction } from '../actions/setTodaysDateAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { getConsolidatedCaseDeadlineAction } from '@web-client/presenter/actions/CaseDeadline/getConsolidatedCaseDeadlineAction';
import { setConsolidatedCaseDeadlineAction } from '@web-client/presenter/actions/CaseDeadline/setConsolidatedCaseDeadlineAction';

export const openEditCaseDeadlineModalSequence = [
  stopShowValidationAction,
  clearModalStateAction,
  clearFormAction,
  setCaseDeadlineFormAction,
  setTodaysDateAction,
  getConsolidatedCaseDeadlineAction,
  setConsolidatedCaseDeadlineAction,
  setShowModalFactoryAction('EditCaseDeadlineModalDialog'),
];
