import { getPublicCaseAction } from '../../actions/Public/getPublicCaseAction';
import { setCaseAction } from '../../actions/setCaseAction';
import { setDefaultDocketRecordSortAction } from '../../actions/DocketRecord/setDefaultDocketRecordSortAction';
import { setupCurrentPageAction } from '../../actions/setupCurrentPageAction';

export const gotoPublicCaseDetailSequence = [
  getPublicCaseAction,
  setCaseAction,
  setDefaultDocketRecordSortAction,
  setupCurrentPageAction('PublicCaseDetail'),
];
