import { setEditOrderTitleDataOnModalAction } from '../actions/CourtIssuedOrder/setEditOrderTitleDataOnModalAction';
import { setSelectedConsolidatedCasesToMultiDocketOnAction } from '@web-client/presenter/actions/setSelectedConsolidatedCasesToMultiDocketOnAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';

export const openEditOrderTitleModalSequence = [
  setSelectedConsolidatedCasesToMultiDocketOnAction(false),
  setEditOrderTitleDataOnModalAction,
  setShowModalFactoryAction('EditOrderTitleModal'),
];
