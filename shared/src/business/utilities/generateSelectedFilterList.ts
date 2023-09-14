import { TRIAL_STATUS_TYPES } from '../entities/EntityConstants';

export const generateCaseStatus = trialStatus => {
  if (!trialStatus) return 'Unassigned';

  let foundTrialStatusFromConstant;

  Object.keys(TRIAL_STATUS_TYPES).forEach(key => {
    if (key === trialStatus) {
      foundTrialStatusFromConstant = TRIAL_STATUS_TYPES[trialStatus].label;
    }
  });

  return foundTrialStatusFromConstant;
};

export const isMemberCase = formattedCase => {
  return formattedCase.inConsolidatedGroup && !formattedCase.isLeadCase;
};
