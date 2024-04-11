import { setDefaultContactStateAction } from '@web-client/presenter/actions/StartCase/setDefaultContactStateAction';
import { setFormValueAction } from '../actions/setFormValueAction';
import { updatePartyTypeActionUpdated } from '../actions/StartCase/updatePartyTypeActionUpdated';

export const updateFilingTypeSequence = [
  setFormValueAction,
  updatePartyTypeActionUpdated,
  setDefaultContactStateAction,
];
