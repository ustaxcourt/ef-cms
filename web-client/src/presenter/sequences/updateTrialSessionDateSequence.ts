import { TimeFormats } from '@shared/business/utilities/DateHandler';
import { formatDateFromDatePickerAction } from '@web-client/presenter/actions/formatDateFromDatePickerAction';
import { applyTrialSessionProceedingTypeRulesAction } from '@web-client/presenter/actions/TrialSession/applyTrialSessionProceedingTypeRulesAction';
import { setFormValueAction } from '../actions/setFormValueAction';

export const updateTrialSessionDateSequence = [
  formatDateFromDatePickerAction,
  setFormValueAction,
  applyTrialSessionProceedingTypeRulesAction,
] as unknown as (props: {
  key: string;
  value: string;
  toFormat: TimeFormats;
}) => void;
