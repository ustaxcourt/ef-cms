import { getPublicCaseAction } from '../../actions/Public/getPublicCaseAction';
import { setBaseUrlAction } from '../../actions/setBaseUrlAction';
import { setCaseAction } from '../../actions/setCaseAction';
import { setCurrentPageAction } from '../../actions/setCurrentPageAction';

export const gotoPublicCaseDetailSequence = [
  getPublicCaseAction,
  setCaseAction,
  setBaseUrlAction,
  setCurrentPageAction('PublicCaseDetail'),
];
