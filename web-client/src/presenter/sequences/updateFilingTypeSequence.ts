import { clearAlertsAction } from '@web-client/presenter/actions/clearAlertsAction';
import { setDefaultContactStateAction } from '@web-client/presenter/actions/StartCase/setDefaultContactStateAction';
import { setFormValueAction } from '../actions/setFormValueAction';
import { stopShowValidationAction } from '@web-client/presenter/actions/stopShowValidationAction';
import { updatePartyTypeActionUpdated } from '../actions/StartCase/updatePartyTypeActionUpdated';

export const updateFilingTypeSequence = [
  clearAlertsAction,
  stopShowValidationAction,
  setFormValueAction,
  updatePartyTypeActionUpdated,
  setDefaultContactStateAction,
];
