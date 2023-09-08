import { clearAlertsAction } from '../actions/clearAlertsAction';
import { setDocketRecordOverlayModalStateAction } from '@web-client/presenter/actions/DocketEntry/setDocketRecordOverlayModalStateAction';
import { setShowModalAction } from '../actions/setShowModalAction';

export const showDocketRecordDetailModalSequence = [
  clearAlertsAction,
  setDocketRecordOverlayModalStateAction,
  setShowModalAction,
];
