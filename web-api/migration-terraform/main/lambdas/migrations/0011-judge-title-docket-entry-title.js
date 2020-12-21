// get all records
// filter out docketEntry records that match Type B and Type F event codes (get list of event codes for this first)
// fetch judge by name
// set judge name with title on documentMeta and regen doc title with document factory
// validate().toRawObject()
// return for persistence
const createApplicationContext = require('../../../../src/applicationContext');
const {
  COURT_ISSUED_EVENT_CODES,
} = require('../../../../../shared/src/business/entities/EntityConstants');
const {
  CourtIssuedDocumentFactory,
} = require('../../../../../shared/src/business/entities/courtIssuedDocument/CourtIssuedDocumentFactory');
const {
  DocketEntry,
} = require('../../../../../shared/src/business/entities/DocketEntry');
const applicationContext = createApplicationContext({});

let judges = null;

const getRecordsViaMapping = async ({ documentClient, pk, prefix }) => {
  const mappings = await documentClient
    .query({
      ExpressionAttributeNames: {
        '#pk': 'pk',
        '#sk': 'sk',
      },
      ExpressionAttributeValues: {
        ':pk': pk,
        ':prefix': prefix,
      },
      KeyConditionExpression: '#pk = :pk and begins_with(#sk, :prefix)',
      TableName: process.env.SOURCE_TABLE,
      applicationContext,
    })
    .promise()
    .then(res => {
      return res.Items;
    });

  const ids = mappings.map(metadata => metadata.sk);

  const batchGetResults = await documentClient
    .batchGet({
      RequestItems: {
        [process.env.SOURCE_TABLE]: {
          Keys: ids.map(id => ({
            pk: id,
            sk: id,
          })),
        },
      },
      TableName: process.env.SOURCE_TABLE,
      applicationContext,
    })
    .promise()
    .then(res => {
      const items = res.Responses[process.env.SOURCE_TABLE];
      return items;
    });

  const results = [];
  mappings.forEach(mapping => {
    const entry = batchGetResults.find(
      batchGetEntry => mapping.sk === batchGetEntry.pk,
    );
    if (entry) {
      results.push({
        ...mapping,
        ...entry,
      });
    }
  });

  return results;
};

const migrateItems = async (items, documentClient) => {
  const itemsAfter = [];
  for (const item of items) {
    if (
      item.pk.startsWith('case|') &&
      item.sk.startsWith('docket-entry|') &&
      ['Type B', 'Type F'].includes(item.scenario) &&
      item.judge
    ) {
      if (!judges) {
        judges = await getRecordsViaMapping({
          documentClient,
          pk: 'section|judge',
          prefix: 'user',
        });
      }

      const filingEvent = COURT_ISSUED_EVENT_CODES.find(
        document => item.eventCode === document.eventCode,
      );

      const judge = judges.find(_judge => _judge.name === item.judge);
      const courtIssuedDocument = CourtIssuedDocumentFactory.get({
        ...item,
        documentTitle: filingEvent.documentTitle,
        judgeWithTitle: `${judge.judgeTitle} ${judge.name}`,
      });

      const docketEntryEntity = new DocketEntry(
        { ...item, documentTitle: courtIssuedDocument.getDocumentTitle() },
        { applicationContext },
      );

      itemsAfter.push({
        ...item,
        ...docketEntryEntity.validate().toRawObject(),
      });
    } else {
      itemsAfter.push(item);
    }
  }
  return itemsAfter;
};

exports.migrateItems = migrateItems;
