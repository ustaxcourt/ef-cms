import { clearModalStateAction } from '../actions/clearModalStateAction';
import { props, state } from 'cerebral';
import { set } from 'cerebral/factories';
import { setConfirmEditModalStateAction } from '../actions/setConfirmEditModalStateAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';

export const openConfirmEditModalSequence = [
  clearModalStateAction,
  set(state.path, props.path),
  setConfirmEditModalStateAction,
  setShowModalFactoryAction('ConfirmEditModal'),
];
