const isCaseRecord = item => {
  return item.pk.startsWith('case|') && item.sk.startsWith('case|');
};

const migrateItems = items => {
  const itemsAfter = [];

  for (const item of items) {
    if (isCaseRecord(item)) {
      // if item is a case
      // if item has a closedDate AND status is NOT CLOSED_CASE_STATUSES
      // set closedDate to undefined
      // validate case
    }

    itemsAfter.push(item);
  }
  return itemsAfter;
};

exports.migrateItems = migrateItems;
