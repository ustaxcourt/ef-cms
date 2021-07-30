/**
 * Okay this script is going to query a case in DDB
 * then attempt to download all of its documents
 * and store them locally so we can give them to
 * someone.
 *
 * Format: Index <#> - Eaton Corporation and Subsidiaries - 5576-12
 */
const AWS = require('aws-sdk');
const createApplicationContext = require('../../web-api/src/applicationContext');
const fs = require('fs');
const { Case } = require('../src/business/entities/cases/Case');

const applicationContext = createApplicationContext({});
const S3 = new AWS.S3({ region: 'us-east-1' });

const BUCKET = 'dawson.ustaxcourt.gov-documents-prod-us-east-1';
const OUTPUT_DIR = __dirname + '/download/';

const getCase = async docketNumber => {
  const caseEntity = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({
      applicationContext,
      docketNumber,
    });
  return new Case(caseEntity, { applicationContext });
};

const downloadPdf = async ({
  caseCaption,
  docketEntryId,
  docketEntryNo,
  docketNumber,
}) => {
  // download pdf from S3
  const data = await S3.getObject({
    Bucket: BUCKET,
    Key: docketEntryId,
  }).promise();

  // save to local dir
  const filename = `${docketEntryNo} - ${caseCaption} - ${docketNumber}.pdf`;

  console.log(filename);

  await fs.promises.writeFile(`${OUTPUT_DIR}${filename}`, data.Body);
};

(async () => {
  const docketNumber = '5576-12';
  const caseEntity = await getCase(docketNumber);
  // caseEntity.docketEntries.forEach(e => console.log);
  // console.log(caseEntity.docketEntries[0]);
  // const docketEntries = caseEntity.docketEntries.map(e => );
  for (const docketEntry of caseEntity.docketEntries) {
    const {
      docketEntryId,
      documentTitle,
      index,
      isFileAttached,
      isLegacySealed,
    } = docketEntry;
    // console.log(docketEntry);
    const isSealed = isLegacySealed || documentTitle.indexOf('(SEALED)') > -1;

    console.log(`isSealed; ${isSealed}; ${docketEntryId}, ${index}`);

    continue;

    if (isFileAttached || !isSealed) {
      await downloadPdf({
        caseCaption: caseEntity.caseCaption,
        docketEntryId,
        docketEntryNo: index,
        docketNumber,
      });
    }
  }
})();
