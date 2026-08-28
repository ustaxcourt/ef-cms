import { clearModalAction } from '../actions/clearModalAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { refreshCaseMetadataAction } from '../actions/refreshCaseMetadataAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';
import { unsealAddressAction } from '../actions/unsealAddressAction';

export const unsealAddressSequence = showProgressSequenceDecorator([
  unsealAddressAction,
  clearModalAction,
  clearModalStateAction,
  setAlertSuccessAction,
  refreshCaseMetadataAction,
]);
