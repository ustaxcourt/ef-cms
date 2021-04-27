const createApplicationContext = require('../../../../src/applicationContext');
const {
  Case,
} = require('../../../../../shared/src/business/entities/cases/Case');
const {
  SERVICE_INDICATOR_TYPES,
} = require('../../../../../shared/src/business/entities/EntityConstants');

const applicationContext = createApplicationContext({});

const migrateItems = async items => {
  const itemsAfter = [];
  for (const item of items) {
    if (item.pk.startsWith('case|') && item.sk.startsWith('case|')) {
      for (const petitioner of item.petitioners) {
        if (!petitioner.serviceIndicator) {
          // TODO - should we call setSerivceIndicatorsForCase?

          // Refactor setServiceIndicators for case: if contactId is in a practitioner's array, they are represented

          // if you are represented, SI is NONE
          // if you have an email AND you are represented, SI is NONE
          // if you have an email AND you are NOT represented, SI is ELECTRONIC
          // if the case is paper, you are NOT represented, and you DONT have an email, SI is PAPER
          petitioner.serviceIndicator = SERVICE_INDICATOR_TYPES.SI_NONE;
        }
      }

      new Case(item, { applicationContext }).validate();

      applicationContext.logger.info(
        `Updating case ${item.docketNumber} to add serviceIndicator for any petitioners that don't already have one.`,
        {
          pk: item.pk,
          sk: item.sk,
        },
      );

      itemsAfter.push(item);
    } else {
      itemsAfter.push(item);
    }
  }
  return itemsAfter;
};

exports.migrateItems = migrateItems;
