import { set } from 'cerebral/factories';
import { state } from 'cerebral';

export const openCreateOrderChooseTypeModalSequence = [
  set(state.showModal, 'CreateOrderChooseTypeModal'),
];
