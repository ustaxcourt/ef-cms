const isTrialSessionWorkingCopy = item => {
  return item.pk.startsWith('trial-session-working-copy|');
};

const migrateItems = items => {
  for (const item of items) {
    if (isTrialSessionWorkingCopy(item)) {
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
