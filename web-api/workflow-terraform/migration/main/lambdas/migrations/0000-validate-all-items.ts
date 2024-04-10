export const migrateItems = (
  items: any[],
  applicationContext: IApplicationContext,
) => {
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
