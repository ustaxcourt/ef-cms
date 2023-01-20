// usage: npx ts-node shared/admin-tools/download-all-case-documents.js "453-17"

const createApplicationContext = require('../../web-api/src/applicationContext');
const fs = require('fs');
const {
  getCaseByDocketNumber,
} = require('../src/persistence/dynamo/cases/getCaseByDocketNumber');

const docketNumber = process.argv[3] || '453-17';
const OUTPUT_DIR = `${process.env.HOME}/Downloads/${docketNumber}`;

const downloadPdf = async ({
  applicationContext,
  docketEntryId,
  filename,
  outputDir,
}) => {
  console.log(`BEGIN --- ${filename}`);

  // download pdf from S3
  const data = await applicationContext
    .getStorageClient()
    .getObject({
      Bucket: applicationContext.environment.documentsBucketName,
      Key: docketEntryId,
    })
    .promise();

  await fs.promises.writeFile(`${outputDir}/${filename}`, data.Body);

  console.log(`COMPLETE --- ${filename}`);
};

(async () => {
  const applicationContext = createApplicationContext({});

  const sealedDir = `${OUTPUT_DIR}/sealed`;
  if (!fs.existsSync(sealedDir)) {
    fs.mkdirSync(sealedDir, { recursive: true });
  }
  const unsealedDir = `${OUTPUT_DIR}/unsealed`;
  if (!fs.existsSync(unsealedDir)) {
    fs.mkdirSync(unsealedDir);
  }
  const caseEntity = await getCaseByDocketNumber({
    applicationContext,
    docketNumber,
  });
  console.log(Object.keys(caseEntity.docketEntries[0]));
  let numSealed = 0;
  let numError = 0;
  for (const docketEntry of caseEntity.docketEntries) {
    if (!docketEntry.isFileAttached) {
      continue;
    }
    const sealed =
      docketEntry.isSealed ||
      docketEntry.isLegacySealed ||
      docketEntry.documentTitle.indexOf('(SEALED)') > -1 ||
      docketEntry.additionalInfo2?.indexOf('(SEALED)') > -1;
    if (sealed) {
      numSealed++;
    }
    const docketEntryIndex = docketEntry.index || 'draft';
    try {
      const filename =
        `${docketEntry.docketNumberWithSuffix} - ${docketEntryIndex} - ` +
        `${docketEntry.documentType} - ${caseEntity.caseCaption}.pdf`;
      await downloadPdf({
        applicationContext,
        docketEntryId: docketEntry.docketEntryId,
        filename,
        path: `${OUTPUT_DIR}/${sealed ? '' : 'un'}sealed`,
      });
    } catch (e) {
      numError++;
      console.error(e);
    }
  }

  console.log(`we found this many sealed documents: ${numSealed}`);
  console.log(`we were unable to retrieve this many documents: ${numError}`);
})();
