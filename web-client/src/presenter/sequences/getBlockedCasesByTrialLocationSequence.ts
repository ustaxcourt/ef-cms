import { getBlockedCasesByTrialLocationAction } from '../actions/CaseDetail/getBlockedCasesByTrialLocationAction';
import { getFormattedTrialLocationAction } from '@web-client/presenter/actions/CaseDetail/getFormattedTrialLocationAction';
import { resetBlockedCasesFiltersAction } from '@web-client/presenter/actions/Reports/BlockedCaseReport/resetBlockedCasesFiltersAction';
import { setBlockedCasesAction } from '../actions/CaseDetail/setBlockedCasesAction';
import { setFormValueAction } from '../actions/setFormValueAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';

export const getBlockedCasesByTrialLocationSequence =
  showProgressSequenceDecorator([
    resetBlockedCasesFiltersAction,
    setFormValueAction,
    getFormattedTrialLocationAction,
    getBlockedCasesByTrialLocationAction,
    setBlockedCasesAction,
  ]);
