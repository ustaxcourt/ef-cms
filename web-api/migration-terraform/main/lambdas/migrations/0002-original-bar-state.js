const createApplicationContext = require('../../../../src/applicationContext');
const {
  Practitioner,
} = require('../../../../../shared/src/business/entities/Practitioner');
const {
  STATE_NOT_AVAILABLE,
  US_STATES,
  US_STATES_OTHER,
} = require('../../../../../shared/src/business/entities/EntityConstants');
const applicationContext = createApplicationContext({});
const { invert } = require('lodash');

const validStateAbbreviations = [
  ...Object.keys(US_STATES),
  ...US_STATES_OTHER,
  STATE_NOT_AVAILABLE,
];

const migrateItems = items => {
  const itemsAfter = [];
  for (const item of items) {
    if (
      item.pk.startsWith('user|') &&
      item.sk.startsWith('user|') &&
      item.role &&
      item.role.includes('Practitioner')
    ) {
      if (
        item.originalBarState &&
        validStateAbbreviations.includes(item.originalBarState.toUpperCase())
      ) {
        item.originalBarState = item.originalBarState.toUpperCase();
      } else if (
        item.originalBarState &&
        !validStateAbbreviations.includes(item.originalBarState)
      ) {
        if (item.originalBarState === 'TT') {
          item.originalBarState = 'FM';
        } else if (item.originalBarState === 'CM') {
          item.originalBarState = 'MP';
        } else {
          const stateAbbreviation = invert(US_STATES)[item.originalBarState];

          item.originalBarState = stateAbbreviation || 'N/A';
        }
      } else {
        item.originalBarState = 'N/A';
      }

      new Practitioner(item, { applicationContext }).validateForMigration();

      itemsAfter.push(item);
    } else {
      itemsAfter.push(item);
    }
  }
  return itemsAfter;
};

exports.migrateItems = migrateItems;
