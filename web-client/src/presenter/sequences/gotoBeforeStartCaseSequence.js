import { clearCurrentPageHeaderAction } from '../actions/clearCurrentPageHeaderAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';

export const gotoBeforeStartCaseSequence = [
  setCurrentPageAction('BeforeStartingCase'),
  clearCurrentPageHeaderAction,
];
