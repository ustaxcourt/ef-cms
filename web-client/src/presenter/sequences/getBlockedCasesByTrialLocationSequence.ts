import { getBlockedCasesByTrialLocationAction } from '../actions/CaseDetail/getBlockedCasesByTrialLocationAction';
import { getTrialLocationAction } from '@web-client/presenter/actions/CaseDetail/getTrialLocationAction';
import { resetBlockedCasesFiltersAction } from '@web-client/presenter/actions/Reports/BlockedCaseReport/resetBlockedCasesFiltersAction';
import { setBlockedCasesAction } from '../actions/CaseDetail/setBlockedCasesAction';
import { setFormValueAction } from '../actions/setFormValueAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';

export const getBlockedCasesByTrialLocationSequence =
  showProgressSequenceDecorator([
    getTrialLocationAction,
    {
      blockedCases: [resetBlockedCasesFiltersAction, setFormValueAction],
      trialLocation: [],
    },
    getBlockedCasesByTrialLocationAction,
    setBlockedCasesAction,
  ]);
