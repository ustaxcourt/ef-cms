import { CASE_STATUS_TYPES } from '../../../../../../shared/src/business/entities/EntityConstants';
import { OutboxItem } from '../../../../../../shared/src/business/entities/OutboxItem';
import { WorkItem } from '../../../../../../shared/src/business/entities/WorkItem';
import { aggregateCaseItems } from '../../../../../src/persistence/dynamo/helpers/aggregateCaseItems';
import { createApplicationContext } from '../../../../../src/applicationContext';
import { queryFullCase } from '../utilities/queryFullCase';

const applicationContext = createApplicationContext({});

const isWorkItem = item => {
  return item.pk.startsWith('case|') && item.sk.startsWith('work-item|');
};
const isOutboxItem = item => {
  return (
    item.pk.startsWith('user-outbox|') || item.pk.startsWith('section-outbox|')
  );
};

export const migrateItems = async (items, documentClient) => {
  const itemsAfter: (RawWorkItem | RawOutboxItem)[] = [];

  for (const item of items) {
    if (isWorkItem(item) && item.caseStatus === CASE_STATUS_TYPES.calendared) {
      const fullCase = await queryFullCase(documentClient, item.docketNumber);
      const caseRecord = aggregateCaseItems(fullCase);

      const theWorkItem = new WorkItem(
        {
          ...item,
          trialDate: item.trialDate ?? caseRecord.trialDate,
          trialLocation: caseRecord.trialLocation,
        },
        {
          applicationContext,
        },
      ).validateWithLogging(applicationContext);

      item.trialLocation = theWorkItem.trialLocation;
      item.trialDate = theWorkItem.trialDate;
    }

    if (
      isOutboxItem(item) &&
      item.caseStatus === CASE_STATUS_TYPES.calendared
    ) {
      const fullCase = await queryFullCase(documentClient, item.docketNumber);
      const caseRecord = aggregateCaseItems(fullCase);

      const theOutboxItem = new OutboxItem(
        {
          ...item,
          trialDate: item.trialDate ?? caseRecord.trialDate,
          trialLocation: caseRecord.trialLocation,
        },
        {
          applicationContext,
        },
      ).validateWithLogging(applicationContext);

      item.trialLocation = theOutboxItem.trialLocation;
      item.trialDate = theOutboxItem.trialDate;
    }

    itemsAfter.push(item);
  }

  return itemsAfter;
};
