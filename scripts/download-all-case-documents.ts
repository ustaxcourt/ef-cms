// usage: npx ts-node --transpile-only scripts/download-all-case-documents.js "453-17"

import { createApplicationContext } from '@web-api/applicationContext';
import { getCaseByDocketNumber } from '@web-api/persistence/dynamo/cases/getCaseByDocketNumber';
import fs from 'fs';

const DOCKET_NUMBER = process.argv[2];

if (!DOCKET_NUMBER) {
  console.error('Error: please provide a docket number.');
  process.exit(1);
}

const OUTPUT_DIR = `${process.env.HOME}/Downloads/${DOCKET_NUMBER}`;

const downloadPdf = async ({
  applicationContext,
  docketEntryId,
  filename,
  path,
}: {
  applicationContext: IApplicationContext;
  docketEntryId: string;
  filename: string;
  path: string;
}): Promise<void> => {
  console.log(`BEGIN --- ${filename}`);

  // download pdf from S3
  const data = await applicationContext
    .getStorageClient()
    .getObject({
      Bucket: applicationContext.environment.documentsBucketName,
      Key: docketEntryId,
    })
    .promise();

  if (data && 'Body' in data && data.Body) {
    await fs.promises.writeFile(`${path}/${filename}`, data.Body.toString());
    console.log(`COMPLETE --- ${filename}`);
  } else {
    console.error(`ERROR --- ${filename}`);
  }
};

const generateFilename = ({
  caseCaption,
  docketEntry: { docketNumber, documentType, index },
}: {
  caseCaption: string;
  docketEntry: { docketNumber: string; documentType: string; index: number };
}): string => {
  const MAX_OVERALL_FILE_LENGTH = 64;
  const EXT = '.pdf';

  const filename =
    `${docketNumber} - ${index} - ` + `${documentType} - ${caseCaption}`;

  return `${filename.substring(0, MAX_OVERALL_FILE_LENGTH)}${EXT}`;
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
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
