const isTrialSessionWorkingCopy = item => {
  return item.pk.startsWith('trial-session-working-copy|');
};

const migrateItems = items => {
  for (const item of items) {
    if (isTrialSessionWorkingCopy(item)) {
      item.filters = {
        ...item.filters,
        definiteTrial: true,
        motionToDismiss: true,
        probableSettlement: true,
        probableTrial: true,
      };

      item.filters.basisReached = item.filters.aBasisReached;
      item.filters.submittedCAV = item.filters.takenUnderAdvisement;
      delete item.filters.aBasisReached;
      delete item.filters.takenUnderAdvisement;

      for (const aCase in item.caseMetadata) {
        switch (item.caseMetadata[aCase].trialStatus) {
          case 'aBasisReached':
            item.caseMetadata[aCase].trialStatus = 'basisReached';
            break;
          case 'takenUnderAdvisement':
            item.caseMetadata[aCase].trialStatus = 'submittedCAV';
            break;
        }
      }
    }
  }
  return items;
};

exports.migrateItems = migrateItems;
