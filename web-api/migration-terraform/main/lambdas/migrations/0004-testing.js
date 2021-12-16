const isCaseRecord = item => {
  return item.pk.startsWith('case|') && item.sk.startsWith('case|');
};

const migrateItems = async items => {
  const itemsAfter = [];

  for (const item of items) {
    if (isCaseRecord(item)) {
      item.testing = 'hello world';
    }

    itemsAfter.push(item);
  }
  return itemsAfter;
};

exports.migrateItems = migrateItems;
