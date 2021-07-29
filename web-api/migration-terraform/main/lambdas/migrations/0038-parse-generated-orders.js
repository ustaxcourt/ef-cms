const createApplicationContext = require('../../../../src/applicationContext');
const {
  ORDER_EVENT_CODES,
} = require('../../../../../shared/src/business/entities/EntityConstants');
const {
  parseAndScrapePdfContents,
} = require('../../../../../shared/src/business/useCaseHelper/pdf/parseAndScrapePdfContents');
const { applicationContext } = createApplicationContext({});

const migrateItems = async (items, documentClient) => {
  // item is a docket entry, event code matches an order, and is not legacy?, has documentContentsId
  // parse the pdf
  // documentContents to include case caption and docket number??!!!

  const itemsAfter = [];

  for (const item of items) {
    if (
      item.pk.startsWith('case|') &&
      item.sk.startsWith('docket-entry|') &&
      ORDER_EVENT_CODES.includes(item.eventCode) &&
      item.isLegacy !== true &&
      item.documentContentsId
    ) {
      // get pdfContents from s3 first to pass into below
      let pdfContents;
      // do things
      // const buffer = await utils.getDocument({
      //   applicationContext,
      //   documentContentsId: fullDocketEntry.documentContentsId,
      // });
      parseAndScrapePdfContents({ applicationContext, pdfContents });
      // update s3 file that contains content, ref is documentContentsId
      itemsAfter.push(item);
    } else {
      itemsAfter.push(item);
    }
  }
  return itemsAfter;
};

exports.migrateItems = migrateItems;
