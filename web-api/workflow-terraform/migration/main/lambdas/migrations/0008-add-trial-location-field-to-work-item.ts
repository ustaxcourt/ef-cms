// // this is needed for various utility functions and writing to dynamo
import { aggregateCaseItems } from '../../../../../../shared/src/persistence/dynamo/helpers/aggregateCaseItems';
import createApplicationContext from '../../../../../src/applicationContext';

const {
  WorkItem,
} = require('../../../../../../shared/src/business/entities/WorkItem');

const { queryFullCase } = require('../utilities');

const applicationContext = createApplicationContext({});

const isWorkItem = item => {
  return item.pk.startsWith('case|') && item.sk.startsWith('work-item|');
};

export const migrateItems = async (items, documentClient) => {
  const itemsAfter = [];

  for (const item of items) {
    if (isWorkItem(item)) {
      const fullCase = await queryFullCase(documentClient, item.docketNumber);
      const caseRecord = aggregateCaseItems(fullCase);
      const theWorkItem = new WorkItem(
        {
          ...item,
          trialLocation: caseRecord.trialLocation,
        },
        {
          applicationContext,
        },
      ).validateWithLogging(applicationContext);

      item.trialLocation = theWorkItem.trialLocation;
    }

    itemsAfter.push(item);
  }

  return itemsAfter;
};
