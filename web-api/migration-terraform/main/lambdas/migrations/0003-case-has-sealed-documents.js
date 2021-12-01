const createApplicationContext = require('../../../../src/applicationContext');
const {
  aggregateCaseItems,
} = require('../../../../../shared/src/persistence/dynamo/helpers/aggregateCaseItems');
const {
  Case,
} = require('../../../../../shared/src/business/entities/cases/Case');
const { queryFullCase } = require('../utilities');
const applicationContext = createApplicationContext({});

const isCaseRecord = item => {
  return item.pk.startsWith('case|') && item.sk.startsWith('case|');
};

const migrateItems = async (items, documentClient) => {
  //if the item is a case
  //aggregate the whole case
  //instantiate case entity
  //validate
  const itemsAfter = [];

  for (const item of items) {
    if (isCaseRecord(item)) {
      const fullCase = await queryFullCase(documentClient, item.docketNumber);

      const caseRecord = aggregateCaseItems(fullCase);

      const theCase = new Case(caseRecord, {
        applicationContext,
      }).validateWithLogging(applicationContext);

      item.hasSealedDocuments = theCase.hasSealedDocuments;
    }

    itemsAfter.push(item);
  }
  return itemsAfter;
};

exports.migrateItems = migrateItems;
