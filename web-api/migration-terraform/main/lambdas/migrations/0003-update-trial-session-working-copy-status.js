const createApplicationContext = require('../../../../src/applicationContext');
const {
  TrialSessionWorkingCopy,
} = require('../../../../../shared/src/business/entities/trialSessions/TrialSessionWorkingCopy');

const isTrialSessionWorkingCopy = item => {
  return item.pk.startsWith('trial-session-working-copy|');
};
const applicationContext = createApplicationContext({});

const migrateItems = items => {
  const itemsAfter = [];

  for (const item of items) {
    if (isTrialSessionWorkingCopy(item)) {
      item.filters = {
        basisReached: true,
        continued: true,
        definiteTrial: true,
        dismissed: true,
        motionToDismiss: true,
        probableSettlement: true,
        probableTrial: true,
        recall: true,
        rule122: true,
        setForTrial: true,
        settled: true,
        showAll: true,
        statusUnassigned: true,
        submittedCAV: true,
      };

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

      new TrialSessionWorkingCopy(item).validateWithLogging(applicationContext);
    }

    itemsAfter.push(item);
  }
  return itemsAfter;
};

exports.migrateItems = migrateItems;
