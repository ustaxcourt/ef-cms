const migrateItems = async items => {
  const itemsAfter = [];
  for (const item of items) {
    if (
      (item.pk.startsWith('privatePractitioner|') ||
        item.pk.startsWith('irsPractitioner|')) &&
      item.sk.startsWith('user|')
    ) {
      const [userRole, nameOrBarNumber] = item.pk.split('|');
      const upperCaseNameOrBarNumber = nameOrBarNumber.toUpperCase();
      item.pk = `${userRole}|${upperCaseNameOrBarNumber}`;
    }
    itemsAfter.push(item);
  }
  return itemsAfter;
};

exports.migrateItems = migrateItems;
