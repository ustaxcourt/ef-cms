import { aggregateCaseItems } from '../../../../../../shared/src/persistence/dynamo/helpers/aggregateCaseItems';
const createApplicationContext = require('../../../../../src/applicationContext');
const {
  WorkItem,
} = require('../../../../../../shared/src/business/entities/WorkItem');
import { CASE_STATUS_TYPES } from '../../../../../../shared/src/business/entities/EntityConstants';
import { queryFullCase } from '../utilities/queryFullCase';

const applicationContext = createApplicationContext({});

const isWorkItem = item => {
  return item.pk.startsWith('case|') && item.sk.startsWith('work-item|');
};

export const migrateItems = async (items, documentClient) => {
  // export const migrateItems = async items => {
  const itemsAfter = [];

  for (const item of items) {
    if (isWorkItem(item) && item.calendared === CASE_STATUS_TYPES.calendared) {
      const fullCase = await queryFullCase(documentClient, item.docketNumber);
      const caseRecord = aggregateCaseItems(fullCase);
      //   const caseDetail = await applicationContext
      //     .getUseCases()
      //     .getCaseInteractor(applicationContext, {
      //       docketNumber: item.docketNumber,
      //     });

      const theWorkItem = new WorkItem(
        {
          ...item,
          trialLocation: caseRecord.trialLocation,
          //   trialLocation: caseDetail.trialLocation,
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
