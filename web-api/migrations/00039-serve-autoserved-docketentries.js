const createApplicationContext = require('../src/applicationContext');
const {
  aggregateCaseItems,
} = require('../../shared/src/persistence/dynamo/helpers/aggregateCaseItems');
const {
  aggregatePartiesForService,
} = require('../../shared/src/business/utilities/aggregatePartiesForService.js');
const {
  DocketEntry,
} = require('../../shared/src/business/entities/DocketEntry');
const {
  getDocketNumberFromRecord,
  isDocketEntryRecord,
  upGenerator,
} = require('./utilities');

const applicationContext = createApplicationContext({});

const mutateRecord = async (item, documentClient, tableName) => {
  if (isDocketEntryRecord(item) && !item.servedAt) {
    const docketEntryToUpdate = new DocketEntry(item, { applicationContext });

    if (docketEntryToUpdate.isAutoServed()) {
      const docketNumber = getDocketNumberFromRecord(item);

      const caseRecords = await documentClient
        .query({
          ExpressionAttributeNames: {
            '#pk': 'pk',
          },
          ExpressionAttributeValues: {
            ':pk': `case|${docketNumber}`,
          },
          KeyConditionExpression: '#pk = :pk',
          TableName: tableName,
        })
        .promise();

      const aggregatedCaseRecord = aggregateCaseItems(caseRecords.Items);

      const servedParties = aggregatePartiesForService(aggregatedCaseRecord);

      docketEntryToUpdate.setAsServed(servedParties.all);
      docketEntryToUpdate.servedAt = docketEntryToUpdate.createdAt;

      return { ...item, ...docketEntryToUpdate.validate().toRawObject() };
    }
  }
};

module.exports = { mutateRecord, up: upGenerator(mutateRecord) };
