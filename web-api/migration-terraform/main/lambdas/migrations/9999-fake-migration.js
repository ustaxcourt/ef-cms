const isCase = item =>
  item.pk.startsWith('case|') && item.sk.startsWith('case|');

const migrateItems = async items => {
  const itemsAfter = [];
  for (const item of items) {
    if (isCase(item)) {
      // eslint-disable-next-line @miovision/disallow-date/no-new-date
      item.migrated = new Date().getTime();
    }
    itemsAfter.push(item);
  }
  return itemsAfter;
};

exports.migrateItems = migrateItems;
