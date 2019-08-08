import { clearModalStateAction } from '../actions/clearModalStateAction';
import { props, state } from 'cerebral';
import { set } from 'cerebral/factories';

export const openConfirmRescanBatchModalSequence = [
  clearModalStateAction,
  set(state.batchIndexToRescan, props.batchIndexToRescan),
  set(state.showModal, 'ConfirmRescanBatchModal'),
];
