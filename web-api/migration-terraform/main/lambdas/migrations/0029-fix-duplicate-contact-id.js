const createApplicationContext = require('../../../../src/applicationContext');
const {
  aggregateCaseItems,
} = require('../../../../../shared/src/persistence/dynamo/helpers/aggregateCaseItems');
const {
  Case,
} = require('../../../../../shared/src/business/entities/cases/Case');
const {
  CASE_STATUS_TYPES,
} = require('../../../../../shared/src/business/entities/EntityConstants');
const { cloneDeep } = require('lodash');
const applicationContext = createApplicationContext({});

const hasMatchingContactId = item => {
  return item.contactPrimary.contactId === item.contactSecondary?.contactId;
};

const migrateItems = async items => {
  const itemsAfter = [];
  for (const item of items) {
    if (
      item.pk.includes('case|') &&
      item.sk.includes('case|') &&
      item.status &&
      item.status !== CASE_STATUS_TYPES.closed &&
      hasMatchingContactId(item)
    ) {
      let itemToModify = cloneDeep(item);

      const newContactId = applicationContext.getUniqueId();

      console.log('item.pk', item.pk);

      applicationContext.logger.info(
        'changing contactSecondary contactId to a new unused unique id',
        {
          newContactId,
          oldContactId: itemToModify.contactSecondary.contactId,
          pk: itemToModify.pk,
          sk: itemToModify.sk,
        },
      );

      itemToModify.contactSecondary.contactId = newContactId;

      new Case(aggregateCaseItems([itemToModify]), {
        applicationContext,
      }).validate();

      itemsAfter.push(itemToModify);
    } else {
      itemsAfter.push(item);
    }
  }
  return itemsAfter;
};

exports.migrateItems = migrateItems;
exports.applicationContext = applicationContext; // for mocking in tests
