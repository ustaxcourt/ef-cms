const { TRIAL_STATUS_TYPES } = require('../entities/EntityConstants');

const generateCaseStatus = (
  trialStatus,
  areUpdatedTrialSessionTypesEnabled,
) => {
  if (!trialStatus) return 'Unassigned';

  let foundTrialStatusFromConstant;

  Object.keys(TRIAL_STATUS_TYPES).forEach(key => {
    if (key === trialStatus) {
      foundTrialStatusFromConstant =
        !areUpdatedTrialSessionTypesEnabled &&
        TRIAL_STATUS_TYPES[trialStatus].legacyLabel
          ? TRIAL_STATUS_TYPES[trialStatus].legacyLabel
          : TRIAL_STATUS_TYPES[trialStatus].label;
    }
  });

  return foundTrialStatusFromConstant;
};

const isMemberCase = formattedCase => {
  return formattedCase.inConsolidatedGroup && !formattedCase.isLeadCase;
};

module.exports = {
  generateCaseStatus,
  isMemberCase,
};
