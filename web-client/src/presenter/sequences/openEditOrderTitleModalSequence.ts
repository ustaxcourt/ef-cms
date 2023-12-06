import { setEditOrderTitleDataOnModalAction } from '../actions/CourtIssuedOrder/setEditOrderTitleDataOnModalAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';

export const openEditOrderTitleModalSequence = [
  setEditOrderTitleDataOnModalAction,
  setShowModalFactoryAction('EditOrderTitleModal'),
];
