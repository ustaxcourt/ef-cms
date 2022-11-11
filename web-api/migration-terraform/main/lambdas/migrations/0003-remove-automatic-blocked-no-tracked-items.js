const isCase = item => {
  return item.pk.startsWith('case|') && item.sk.startsWith('case|');
};

const doesHavePendingItems = item => {
  // something like
  // return item.docketEntries.some(docketEntry =>
  //   DocketEntry.isPending(docketEntry),
  // );
};

const doesHaveCaseDeadlines = item => {
  // something like
  // do another check for that item in dynamo?
  // getRecordsViaMapping({
  //   applicationContext,
  //   pk: `case|${docketNumber}`,
  //   prefix: 'case-deadline',
  // });
};

const migrateItems = items => {
  const itemsAfter = [];

  // look for Cases with trialDate and no pending items or deadlines
  // update automatic blocked
  // this.automaticBlocked = false;
  // this.automaticBlockedDate = undefined;
  // this.automaticBlockedReason = undefined;

  // check if there's local data already structured like this to verify, otherwise add
  // case 101-20, has trialDate, but no tracked items
  for (const item of items) {
    if (
      isCase(item) &&
      item.trialDate &&
      (doesHavePendingItems || doesHaveCaseDeadlines)
    ) {
      item.automaticBlocked = false;
      item.automaticBlockedDate = undefined;
      item.automaticBlockedReason = undefined;
    }

    itemsAfter.push(item);
  }
  return itemsAfter;
};

exports.migrateItems = migrateItems;
