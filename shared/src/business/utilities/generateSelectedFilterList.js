const generateCaseStatus = (trialStatus, filters) => {
  if (!trialStatus) return 'Unassigned';

  const foundTrialStatusFromMap = filters.find(filter => {
    return filter.key === trialStatus;
  });

  return foundTrialStatusFromMap.label;
};

const isMemberCase = formattedCase => {
  return formattedCase.inConsolidatedGroup && !formattedCase.leadCase;
};

module.exports = {
  generateCaseStatus,
  isMemberCase,
};
