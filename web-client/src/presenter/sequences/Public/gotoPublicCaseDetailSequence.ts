import { getPublicCaseAction } from '../../actions/Public/getPublicCaseAction';
import { setCaseAction } from '../../actions/setCaseAction';
import { setupCurrentPageAction } from '../../actions/setupCurrentPageAction';

export const gotoPublicCaseDetailSequence = [
  getPublicCaseAction,
  setCaseAction,
  setupCurrentPageAction('PublicCaseDetail'),
];
