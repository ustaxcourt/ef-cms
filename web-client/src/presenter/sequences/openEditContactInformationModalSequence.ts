import { setModalFormValueAction } from '../actions/setModalFormValueAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';
import { clearModalFormSequence } from './clearModalFormSequence';

export const openEditContactInformationModalSequence = [
  clearModalFormSequence,
  setModalFormValueAction,
  setShowModalFactoryAction('EditContactInformationModal'),
];
