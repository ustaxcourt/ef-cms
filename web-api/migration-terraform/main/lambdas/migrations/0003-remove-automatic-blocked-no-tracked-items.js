const {
  UNSERVABLE_EVENT_CODES,
} = require('../../../../../shared/src/business/entities/EntityConstants');

const isCase = item => {
  return item.pk.startsWith('case|') && item.sk.startsWith('case|');
};

const isPending = docketEntry => {
  return (
    docketEntry.pending &&
    (isServed(docketEntry) ||
      UNSERVABLE_EVENT_CODES.find(
        unservedCode => unservedCode === docketEntry.eventCode,
      ))
  );
};

const isServed = docketEntry => {
  return !!docketEntry.servedAt || !!docketEntry.isLegacyServed;
};

const migrateItems = async (items, documentClient) => {
  const itemsAfter = [];
  for (const item of items) {
    if (isCase(item) && item.trialDate) {
      const caseDeadlines = await documentClient
        .get({
          Key: {
            pk: `case|${item.docketNumber}`,
            prefix: 'case-deadline',
          },
          TableName: process.env.SOURCE_TABLE,
        })
        .promise()
        .then(res => {
          return res.Item;
        });

      const pendingItems = item.docketEntries.some(docketEntry =>
        isPending(docketEntry),
      );

      if (!caseDeadlines && !pendingItems) {
        item.automaticBlocked = false;
        item.automaticBlockedDate = undefined;
        item.automaticBlockedReason = undefined;
      }
    }

    itemsAfter.push(item);
  }
  return itemsAfter;
};

exports.migrateItems = migrateItems;
