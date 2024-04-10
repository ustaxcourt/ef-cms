import { setContactStateAction } from '@web-client/presenter/actions/StartCase/setContactStateAction';
import { setFormValueAction } from '../actions/setFormValueAction';
import { updatePartyTypeActionUpdated } from '../actions/StartCase/updatePartyTypeActionUpdated';

export const updateFilingTypeSequence = [
  setFormValueAction,
  updatePartyTypeActionUpdated,
  setContactStateAction,
];
