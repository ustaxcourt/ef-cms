import { getPublicCaseAction } from '../../actions/Public/getPublicCaseAction';
import { setCaseAction } from '../../actions/setCaseAction';
import { setDefaultDocketEntriesTableSortAction } from '@web-client/presenter/actions/setDefaultDocketEntriesTableSortAction';
import { setDefaultDocketRecordSortAndFilterAction } from '@web-client/presenter/actions/DocketRecord/setDefaultDocketRecordSortAndFilterAction';
import { setupCurrentPageAction } from '../../actions/setupCurrentPageAction';
import { showProgressSequenceDecorator } from '@web-client/presenter/utilities/showProgressSequenceDecorator';

export const gotoPublicCaseDetailSequence = showProgressSequenceDecorator([
  getPublicCaseAction,
  setCaseAction,
  setDefaultDocketEntriesTableSortAction,
  setDefaultDocketRecordSortAndFilterAction,
  setupCurrentPageAction('PublicCaseDetail'),
]);
