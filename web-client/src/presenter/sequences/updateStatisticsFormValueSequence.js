import { clearStatisticsFormValuesAction } from '../actions/clearStatisticsFormValuesAction';
import { setFormValueAction } from '../actions/setFormValueAction';

export const updateStatisticsFormValueSequence = [
  setFormValueAction,
  clearStatisticsFormValuesAction,
];
