const isCaseRecord = item => {
  return item.pk.startsWith('case|') && item.sk.startsWith('case|');
};

const migrateItems = items => {
  const itemsAfter = [];

  for (const item of items) {
    if (isCaseRecord(item)) {
      delete item.hasSealedDocuments;
    }

    itemsAfter.push(item);
  }
  return itemsAfter;
};

exports.migrateItems = migrateItems;
