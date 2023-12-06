import { resetAdvancedDocumentSearchDatesAction } from '../actions/AdvancedSearch/resetAdvancedDocumentSearchDatesAction';
import { updateAdvancedSearchFormAction } from '../actions/AdvancedSearch/updateAdvancedSearchFormAction';

export const updateAdvancedOrderSearchFormValueSequence = [
  updateAdvancedSearchFormAction('orderSearch'),
  resetAdvancedDocumentSearchDatesAction,
];
