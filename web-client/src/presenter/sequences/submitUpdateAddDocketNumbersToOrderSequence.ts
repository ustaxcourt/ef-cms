import { clearModalAction } from '../actions/clearModalAction';
import { setCreateOrderSelectedCasesAction } from '@web-client/presenter/actions/setCreateOrderSelectedCasesAction';
import { setSelectedConsolidatedCasesToMultiDocketOnAction } from '../actions/setSelectedConsolidatedCasesToMultiDocketOnAction';

export const submitUpdateAddDocketNumbersToOrderSequence = [
  clearModalAction,
  setCreateOrderSelectedCasesAction,
  setSelectedConsolidatedCasesToMultiDocketOnAction(true),
];
