const createApplicationContext = require('../../../../src/applicationContext');
const {
  aggregateCaseItems,
} = require('../../../../../shared/src/persistence/dynamo/helpers/aggregateCaseItems');
const {
  Case,
} = require('../../../../../shared/src/business/entities/cases/Case');
const {
  SERVICE_INDICATOR_TYPES,
} = require('../../../../../shared/src/business/entities/EntityConstants');
const {
  setServiceIndicatorsForCase,
} = require('../../../../../shared/src/business/utilities/setServiceIndicatorsForCase');
const { cloneDeep } = require('lodash');
const applicationContext = createApplicationContext({});

const contactHasServiceIndicatorNone = contact => {
  let hasNone = false;
  if (
    contact &&
    contact.serviceIndicator &&
    contact.serviceIndicator === SERVICE_INDICATOR_TYPES.SI_NONE
  ) {
    hasNone = true;
  }

  return hasNone;
};

const migrateItems = async (items, documentClient) => {
  const itemsAfter = [];
  for (const item of items) {
    if (
      item.pk.includes('case|') &&
      item.sk.includes('case|') &&
      (contactHasServiceIndicatorNone(item.contactPrimary) ||
        contactHasServiceIndicatorNone(item.contactSecondary))
    ) {
      const privatePractitioners = await documentClient
        .query({
          ExpressionAttributeNames: {
            '#pk': 'pk',
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

      const currentCaseEntity = new Case(caseRecord, { applicationContext });

      let shouldUpdateServiceIndicators = false;

      // we check the service indicator again to prevent overwriting an intentional
      // service preference since the outer conditional is evaluation BOTH contacts
      const shouldUpdateContactPrimary =
        contactHasServiceIndicatorNone(item.contactPrimary) &&
        !currentCaseEntity.isUserIdRepresentedByPrivatePractitioner(
          item.contactPrimary.contactId,
        );
      if (shouldUpdateContactPrimary) {
        delete itemToModify.contactPrimary.serviceIndicator;
        shouldUpdateServiceIndicators = true;
      }

      // we check the service indicator again to prevent overwriting an intentional
      // service preference since the outer conditional is evaluation BOTH contacts
      const shouldUpdateContactSecondary =
        contactHasServiceIndicatorNone(item.contactSecondary) &&
        !!(
          item.contactSecondary &&
          !currentCaseEntity.isUserIdRepresentedByPrivatePractitioner(
            item.contactSecondary.contactId,
          )
        );

      if (shouldUpdateContactSecondary) {
        delete itemToModify.contactSecondary.serviceIndicator;
        shouldUpdateServiceIndicators = true;
      }

      if (shouldUpdateServiceIndicators) {
        // we only care about mutations to the contacts service preference
        const {
          contactPrimary,
          contactSecondary,
        } = setServiceIndicatorsForCase({
          ...itemToModify,
          privatePractitioners: [...caseRecord.privatePractitioners],
        });

        if (shouldUpdateContactPrimary && contactPrimary) {
          // trying to reduce blast radius on what actually gets mutated on the item
          itemToModify.contactPrimary = {
            ...item.contactPrimary,
            serviceIndicator: contactPrimary.serviceIndicator,
          };
        }

        if (shouldUpdateContactSecondary && contactSecondary) {
          // trying to reduce blast radius on what actually gets mutated on the item
          itemToModify.contactSecondary = {
            ...item.contactSecondary,
            serviceIndicator: contactSecondary.serviceIndicator,
          };
        }

        new Case(
          { ...caseRecord, itemToModify },
          {
            applicationContext,
          },
        ).validate();

        applicationContext.logger.info(
          'Updating service indicator for contact(s)',
          {
            pk: item.pk,
            sk: item.sk,
            updateContactPrimary: shouldUpdateContactPrimary,
            updateContactSecondary: shouldUpdateContactSecondary,
          },
        );

        itemsAfter.push(itemToModify);
      } else {
        itemsAfter.push(item);
      }
    } else {
      itemsAfter.push(item);
    }
  }
  return itemsAfter;
};

exports.contactHasServiceIndicatorNone = contactHasServiceIndicatorNone;
exports.migrateItems = migrateItems;
