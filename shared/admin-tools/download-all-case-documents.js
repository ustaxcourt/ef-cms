// usage: npx ts-node --transpile-only shared/admin-tools/download-all-case-documents.js "453-17"

const fs = require('fs');
const {
  createApplicationContext,
} = require('../../web-api/src/applicationContext');
const {
  getCaseByDocketNumber,
} = require('../../web-api/src/persistence/dynamo/cases/getCaseByDocketNumber');

const DOCKET_NUMBER = process.argv[2];
const OUTPUT_DIR = `${process.env.HOME}/Downloads/${DOCKET_NUMBER}`;

const downloadPdf = async ({
  applicationContext,
  docketEntryId,
  filename,
  path,
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

  await fs.promises.writeFile(`${path}/${filename}`, data.Body);

  console.log(`COMPLETE --- ${filename}`);
};

const generateFilename = ({
  caseCaption,
  docketEntry: { docketNumber, documentType, index },
}) => {
  const MAX_OVERALL_FILE_LENGTH = 64;
  const EXT = '.pdf';

  const filename =
    `${docketNumber} - ${index} - ` + `${documentType} - ${caseCaption}`;

  return `${filename.substring(0, MAX_OVERALL_FILE_LENGTH)}${EXT}`;
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
    docketNumber: DOCKET_NUMBER,
  });
  let numSealed = 0;
  let numError = 0;
  for (const docketEntry of caseEntity.docketEntries) {
    if (!docketEntry.isFileAttached || !docketEntry.index) {
      console.log('did not download docket entry', docketEntry);
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
    try {
      const filename = generateFilename({
        caseCaption: caseEntity.caseCaption,
        docketEntry,
      });
      await downloadPdf({
        applicationContext,
        docketEntryId: docketEntry.docketEntryId,
        filename,
        path: sealed ? sealedDir : unsealedDir,
      });
    } catch (e) {
      numError++;
      console.error(e);
    }
  }

  console.log(`we found this many sealed documents: ${numSealed}`);
  console.log(`we were unable to retrieve this many documents: ${numError}`);
})();
