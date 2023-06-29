const isWorkItem = item => {
  return item.pk.startsWith('case|') && item.sk.startsWith('work-item|');
};

export const migrateItems = items => {
  for (const item of items) {
    if (isWorkItem(item)) {
      if (item.assigneeId) {
        item.gsi2pk = `assigneeId|${item.assigneeId}`;
      }
    }
  }

  return items;
};
