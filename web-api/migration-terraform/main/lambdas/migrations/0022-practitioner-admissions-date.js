// if item is a practitioner
// convert admissionsDate to date only, no timestamp


const migrateItems = async items => {
  const itemsAfter = [];
  for (const item of items) {
    if (
      (item.pk.startsWith('privatePractitioner|') ||
        item.pk.startsWith('irsPractitioner|')) &&
      item.sk.startsWith('user|')
    ) {

      
    }
    itemsAfter.push(item);
  }
  return itemsAfter;
};

exports.migrateItems = migrateItems;
