import { getBlockedCasesByTrialLocationAction } from '../actions/CaseDetail/getBlockedCasesByTrialLocationAction';
import { setBlockedCasesAction } from '../actions/CaseDetail/setBlockedCasesAction';
import { setFormValueAction } from '../actions/setFormValueAction';
import { setProcedureTypeToAllAction } from '../actions/setProcedureTypeToAllAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';

export const getBlockedCasesByTrialLocationSequence =
  showProgressSequenceDecorator([
    setProcedureTypeToAllAction,
    setFormValueAction,
    getBlockedCasesByTrialLocationAction,
    setBlockedCasesAction,
  ]);
