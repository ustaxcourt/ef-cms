import { serverApplicationContext } from '../../../../../src/applicationContext';

serverApplicationContext.setCurrentUser();
const applicationContext = serverApplicationContext;

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
