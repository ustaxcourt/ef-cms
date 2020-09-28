const migrateItems = items => {
  return items.filter(item => {
    if (
      item.gsi1pk &&
      item.gsi1pk.includes('eligible-for-trial-case-catalog|')
    ) {
      const caseIdentifier = item.gsi1pk.split('|')[1];
      if (caseIdentifier.length === 36) {
        return false;
      }
    }
    return true;
  });
};

exports.migrateItems = migrateItems;
