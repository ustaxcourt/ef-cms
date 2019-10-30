import { clearModalStateAction } from '../actions/clearModalStateAction';
import { props, state } from 'cerebral';
import { set } from 'cerebral/factories';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';

export const openConfirmRescanBatchModalSequence = [
  clearModalStateAction,
  set(state.batchIndexToRescan, props.batchIndexToRescan),
  setShowModalFactoryAction('ConfirmRescanBatchModal'),
];
