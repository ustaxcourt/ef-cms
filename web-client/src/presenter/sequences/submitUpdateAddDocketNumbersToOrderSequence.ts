import { clearModalAction } from '../actions/clearModalAction';
import { setSelectedConsolidatedCasesToMultiDocketOnAction } from '../actions/setSelectedConsolidatedCasesToMultiDocketOnAction';

export const submitUpdateAddDocketNumbersToOrderSequence = [
  clearModalAction,
  setSelectedConsolidatedCasesToMultiDocketOnAction(true),
];
