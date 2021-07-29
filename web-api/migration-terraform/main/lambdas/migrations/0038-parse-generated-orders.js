const createApplicationContext = require('../../../../src/applicationContext');
const {
  ORDER_EVENT_CODES,
} = require('../../../../../shared/src/business/entities/EntityConstants');
const {
  parseAndScrapePdfContents,
} = require('../../../../../shared/src/business/useCaseHelper/pdf/parseAndScrapePdfContents');
const { applicationContext } = createApplicationContext({});

const migrateItems = async items => {
  const itemsAfter = [];

  for (const item of items) {
    if (
      item.pk.startsWith('case|') &&
      item.sk.startsWith('docket-entry|') &&
      ORDER_EVENT_CODES.includes(item.eventCode) &&
      item.isLegacy !== true &&
      item.documentContentsId
    ) {
      let pdfContents;
      try {
        const pdfBuffer = await applicationContext
          .getPersistenceGateway()
          .getDocument({
            applicationContext,
            key: item.docketEntryId,
            protocol: 'S3',
            useTempBucket: false,
          });

        pdfContents = await parseAndScrapePdfContents({
          applicationContext,
          pdfBuffer,
        });

        const contentToStore = {
          documentContents: pdfContents,
        };

        await applicationContext
          .getPersistenceGateway()
          .saveDocumentFromLambda({
            applicationContext,
            contentType: 'application/json',
            document: Buffer.from(JSON.stringify(contentToStore)),
            key: item.documentContentsId,
            useTempBucket: false,
          });
      } catch (e) {
        applicationContext.logger.error(
          `Failed to parse PDF for docket entry ${item.docketEntryId}`,
          e,
        );
      }

      itemsAfter.push(item);
    } else {
      itemsAfter.push(item);
    }
  }
  return itemsAfter;
};

exports.migrateItems = migrateItems;
