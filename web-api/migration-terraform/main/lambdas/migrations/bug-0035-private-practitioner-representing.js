const createApplicationContext = require('../../../../src/applicationContext');
const {
  Case,
} = require('../../../../../shared/src/business/entities/cases/Case');

const applicationContext = createApplicationContext({});

const migrateItems = async (items, documentClient) => {
  const itemsAfter = [];
  for (const item of items) {
    if (
      item.pk.startsWith('case|') &&
      item.sk.startsWith('privatePractitioner|')
    ) {
      const docketNumber = item.pk.split('|')[1];

      const caseRecord = await documentClient
        .get({
          Key: {
            pk: `case|${docketNumber}`,
            sk: `case|${docketNumber}`,
          },
          TableName: process.env.SOURCE_TABLE,
        })
        .promise()
        .then(res => {
          return res.Item;
        });

      item.representing = item.representing.filter(representingContactId =>
        caseRecord.petitioners.find(p => p.contactId === representingContactId),
      );

      if (item.representing.length) {
        new Case(
          { ...caseRecord, privatePractitioners: [item] },
          {
            applicationContext,
          },
        ).validateForMigration();

        applicationContext.logger.info(
          'Updating representing array for private practitioner record',
          {
            pk: item.pk,
            sk: item.sk,
          },
        );

        itemsAfter.push(item);
      } else {
        applicationContext.logger.info(
          'Deleting private practitioner record because representing is empty',
          {
            pk: item.pk,
            sk: item.sk,
          },
        );

        await documentClient
          .delete({
            Key: {
              pk: `user|${item.userId}`,
              sk: `case|${docketNumber}`,
            },
            TableName: process.env.SOURCE_TABLE,
          })
          .promise();
      }
    } else {
      itemsAfter.push(item);
    }
  }
  return itemsAfter;
};

exports.migrateItems = migrateItems;
