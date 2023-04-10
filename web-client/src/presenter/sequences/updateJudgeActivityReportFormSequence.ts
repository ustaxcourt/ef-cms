import { formatDateToYYYMMDDAction } from '../actions/JudgeActivityReport/formatDateToYYYMMDDAction';
import { setFormValueAction } from '../actions/setFormValueAction';

export const updateJudgeActivityReportFormSequence = [
  formatDateToYYYMMDDAction,
  setFormValueAction,
];
