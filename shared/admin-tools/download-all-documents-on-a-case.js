/**
 * Okay this script is going to query a case in DDB
 * then attempt to download all of its documents
 * and store them locally so we can give them to
 * someone.
 *
 * Format: Index <#> - Eaton Corporation and Subsidiaries - 5576-12
 */
const createApplicationContext = require('../../web-api/src/applicationContext');
const fs = require('fs');
const { S3 } = require('aws-sdk');

const applicationContext = createApplicationContext({});
const s3Client = new S3({ region: 'us-east-1' });

const BUCKET = 'dawson.ustaxcourt.gov-documents-prod-us-east-1';
const OUTPUT_DIR = __dirname + '/download/';

const downloadPdf = async ({
  caseCaption,
  docketEntryId,
  docketEntryNo,
  docketNumber,
  path,
}) => {
  // download pdf from S3
  const data = await s3Client
    .getObject({
      Bucket: BUCKET,
      Key: docketEntryId,
    })
    .promise();

  // save to local dir
  docketEntryNo = ('000' + docketEntryNo).slice(-3);
  const filename = `${docketEntryNo} - ${caseCaption} - ${docketNumber}.pdf`;

  console.log(filename);

  await fs.promises.writeFile(`${path}${filename}`, data.Body);
};

(async () => {
  const docketNumber = process.argv[2];

  if (!docketNumber) {
    console.log(
      'Error: please specify a Docket Number\n\n  $ npx ts-node download-all-documents-on-a-case.js 123-45\n',
    );
    return;
  }

  fs.mkdirSync(`${OUTPUT_DIR}${docketNumber}`);

  const caseEntity = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({
      applicationContext,
      docketNumber,
    });

  let numSealed = 0;
  for (const docketEntry of caseEntity.docketEntries) {
    const {
      additionalInfo2,
      docketEntryId,
      documentTitle,
      index,
      isFileAttached,
      isLegacySealed,
    } = docketEntry;

    if (!isFileAttached) {
      continue;
    }

    const isSealed =
      isLegacySealed ||
      documentTitle.indexOf('(SEALED)') > -1 ||
      additionalInfo2?.indexOf('(SEALED)') > -1;

    if (isSealed) {
      numSealed++;
      // console.log(`${index} - ${documentTitle}`);
    }

    await downloadPdf({
      caseCaption: caseEntity.caseCaption,
      docketEntryId,
      docketEntryNo: index,
      docketNumber,
      path: `${OUTPUT_DIR}${docketNumber}/`,
    });
  }

  console.log(`we found this many sealed documents: ${numSealed}`);
})();
