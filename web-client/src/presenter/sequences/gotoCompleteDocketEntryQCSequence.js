import { clearModalAction } from '../actions/clearModalAction';
import { getCaseAction } from '../actions/getCaseAction';
import { isWorkItemAlreadyCompletedAction } from '../actions/isWorkItemAlreadyCompletedAction';
import { navigateToDocketQcAction } from '../actions/navigateToDocketQcAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';

export const gotoCompleteDocketEntryQCSequence = [
  getCaseAction,
  setCaseAction,
  isWorkItemAlreadyCompletedAction,
  {
    no: [clearModalAction, navigateToDocketQcAction],
    yes: [setShowModalFactoryAction('WorkItemAlreadyCompletedModal')],
  },
];
