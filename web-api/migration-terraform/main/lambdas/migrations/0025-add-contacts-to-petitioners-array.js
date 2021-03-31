const createApplicationContext = require('../../../../src/applicationContext');
const {
  Case,
} = require('../../../../../shared/src/business/entities/cases/Case');
const {
  CONTACT_TYPES,
} = require('../../../../../shared/src/business/entities/EntityConstants');
const applicationContext = createApplicationContext({});

const migrateItems = async items => {
  const itemsAfter = [];
  for (const item of items) {
    if (item.pk.startsWith('case|') && item.sk.startsWith('case|')) {
      item.otherFilers?.forEach(
        filer => (filer.contactType = CONTACT_TYPES.otherFiler),
      );
      item.otherPetitioners?.forEach(
        filer => (filer.contactType = CONTACT_TYPES.otherPetitioner),
      );

      item.petitioners = [
        ...(item.petitioners || []),
        ...(item.otherFilers || []),
        ...(item.otherPetitioners || []),
      ];

      const updatedCaseRaw = new Case(item, { applicationContext })
        .validate()
        .toRawObject();

      delete item.contactPrimary;
      delete item.contactSecondary;
      delete item.otherFilers;
      delete item.otherPetitioners;

      applicationContext.logger.info(
        'Creating case entity to add contactPrimary and otherFilers to case.petitioners',
        { pk: item.pk, sk: item.sk },
      );

      itemsAfter.push({ ...item, ...updatedCaseRaw });
    } else {
      itemsAfter.push(item);
    }
  }
  return itemsAfter;
};

exports.migrateItems = migrateItems;
