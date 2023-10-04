import { ALL_TRIAL_STATUS_TYPES } from '../entities/EntityConstants';

export const generateCaseStatus = trialStatus => {
  if (!trialStatus) return 'Unassigned';
  return ALL_TRIAL_STATUS_TYPES[trialStatus]?.label;
};

export const isMemberCase = formattedCase => {
  return formattedCase.inConsolidatedGroup && !formattedCase.isLeadCase;
};
