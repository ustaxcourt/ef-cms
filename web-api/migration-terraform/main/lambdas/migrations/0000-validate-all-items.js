const createApplicationContext = require('../../../../src/applicationContext');
const applicationContext = createApplicationContext({});

const migrateItems = items => {
  for (const item of items) {
    const entityConstructor = applicationContext.getEntityByName(
      item.entityName,
    );

    if (entityConstructor) {
      try {
        new entityConstructor(item, { applicationContext }).validate({
          applicationContext,
          logErrors: true,
        });
      } catch (err) {
        const errors = new entityConstructor(item, {
          applicationContext,
        }).getFormattedValidationErrors();
        applicationContext.logger.error(
          `${item.entityName} failed validation: ${err}`,
          {
            errors,
            pk: item.pk,
            sk: item.sk,
          },
        );
        throw err;
      }
    }
  }
  return items;
};

exports.migrateItems = migrateItems;
