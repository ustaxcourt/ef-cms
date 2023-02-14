import { resetCurrentPageIndexAction } from '../actions/resetCurrentPageIndexAction';
import { setSelectedBatchIndexAction } from '../actions/setSelectedBatchIndexAction';

export const setSelectedBatchIndexSequence = [
  resetCurrentPageIndexAction,
  setSelectedBatchIndexAction,
];
