import { clearAddDeficiencyFormValuesAction } from '../actions/clearAddDeficiencyFormValuesAction';
import { setFormValueAction } from '../actions/setFormValueAction';

export const updateAddDeficiencyFormValueSequence = [
  clearAddDeficiencyFormValuesAction,
  setFormValueAction,
];
