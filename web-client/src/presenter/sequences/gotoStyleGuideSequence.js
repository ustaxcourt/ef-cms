import { clearCurrentPageHeaderAction } from '../actions/clearCurrentPageHeaderAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';

export const gotoStyleGuideSequence = [
  clearCurrentPageHeaderAction,
  setCurrentPageAction('StyleGuide'),
];
