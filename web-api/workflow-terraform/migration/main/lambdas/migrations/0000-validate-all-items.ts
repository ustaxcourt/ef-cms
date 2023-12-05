import { createApplicationContext } from '../../../../../src/applicationContext';

const applicationContext = createApplicationContext({});

export const migrateItems = items => {
  for (const item of items) {
    const entityConstructor = applicationContext.getEntityByName(
      item.entityName,
    );

    if (entityConstructor) {
      new entityConstructor(item, {
        applicationContext,
      }).validateForMigration();
    }
  }
  return items;
};
