import { getPublicCaseAction } from '../../actions/Public/getPublicCaseAction';
import { setCaseAction } from '../../actions/setCaseAction';
import { setCurrentPageAction } from '../../actions/setCurrentPageAction';

export const gotoPublicCaseDetailSequence = [
  getPublicCaseAction,
  setCaseAction,
  setCurrentPageAction('PublicCaseDetail'),
];
