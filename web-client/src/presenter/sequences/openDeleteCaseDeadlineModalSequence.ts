import { clearFormAction } from '../actions/clearFormAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { setCaseDeadlineFormAction } from '../actions/CaseDeadline/setCaseDeadlineFormAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';
import { getConsolidatedCaseDeadlineAction } from '@web-client/presenter/actions/CaseDeadline/getConsolidatedCaseDeadlineAction';
import { setConsolidatedCaseDeadlineAction } from '@web-client/presenter/actions/CaseDeadline/setConsolidatedCaseDeadlineAction';

export const openDeleteCaseDeadlineModalSequence = [
  clearModalStateAction,
  clearFormAction,
  setCaseDeadlineFormAction,
  getConsolidatedCaseDeadlineAction,
  setConsolidatedCaseDeadlineAction,
  setShowModalFactoryAction('DeleteCaseDeadlineModalDialog'),
];
