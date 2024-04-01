const isWorkItem = item => {
  return item.pk.startsWith('case|') && item.sk.startsWith('work-item|');
};

export const migrateItems = items => {
  for (const item of items) {
    if (isWorkItem(item)) {
      if (!item.completedAt && (item.inProgress || item.caseIsInProgress)) {
        item.gsiUserBox = item.assigneeId
          ? `assigneeId|inProgress|${item.assigneeId}`
          : undefined;
        item.gsiSectionBox = item.section
          ? `section|inProgress|${item.section}`
          : undefined;
      } else if (!item.completedAt) {
        item.gsiUserBox = item.assigneeId
          ? `assigneeId|inbox|${item.assigneeId}`
          : undefined;
        item.gsiSectionBox = item.section
          ? `section|inbox|${item.section}`
          : undefined;
      }
      item.gsi2pk = undefined;
    }
  }

  return items;
};
