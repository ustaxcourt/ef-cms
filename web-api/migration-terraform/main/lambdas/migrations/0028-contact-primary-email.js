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
const {
  setServiceIndicatorsForCase,
} = require('../../../../../shared/src/business/utilities/setServiceIndicatorsForCase');
const { cloneDeep } = require('lodash');
const applicationContext = createApplicationContext({});

const migrateItems = async (items, documentClient) => {
  const itemsAfter = [];
  for (const item of items) {
    if (
      item.pk.includes('case|') &&
      item.sk.includes('case|') &&
      item.status &&
      item.status !== CASE_STATUS_TYPES.closed
    ) {
      const privatePractitioners = await documentClient
        .query({
          ExpressionAttributeNames: {
            '#pk': 'pk',
            '#sk': 'sk',
          },
          ExpressionAttributeValues: {
            ':pk': item.pk,
            ':prefix': 'privatePractitioner',
          },
          KeyConditionExpression: '#pk = :pk and begins_with(#sk, :prefix)',
          TableName: process.env.SOURCE_TABLE,
        })
        .promise()
        .then(res => {
          return res.Items;
        });

      const caseRecord = aggregateCaseItems([item, ...privatePractitioners]);
      let itemToModify = cloneDeep(item);

      if (
        privatePractitioners.find(
          practitioner =>
            practitioner.email === itemToModify.contactPrimary.email,
        )
      ) {
        applicationContext.logger.info(
          'deleting the email off the contactPrimary',
          {
            email: itemToModify.contactPrimary.email,
            pk: itemToModify.pk,
            serviceIndicator: itemToModify.contactPrimary.serviceIndicator,
            sk: itemToModify.sk,
          },
        );

        delete itemToModify.contactPrimary.email;
        delete itemToModify.contactPrimary.serviceIndicator;

        const { contactPrimary } = setServiceIndicatorsForCase({
          ...itemToModify,
          privatePractitioners: [...caseRecord.privatePractitioners],
        });

        itemToModify.contactPrimary = {
          ...item.contactPrimary,
          email: undefined,
          serviceIndicator: contactPrimary.serviceIndicator,
        };
      }

      new Case(
        { ...caseRecord, ...itemToModify },
        {
          applicationContext,
        },
      ).validate();

      itemsAfter.push(itemToModify);
    } else {
      itemsAfter.push(item);
    }
  }
  return itemsAfter;
};

exports.migrateItems = migrateItems;
exports.applicationContext = applicationContext; // for mocking in tests
