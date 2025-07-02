#!/usr/bin/env -S npx ts-node --transpile-only

import { DocketEntry } from '@shared/business/entities/DocketEntry';
import {
  type ScriptConfig,
  parseArgsAndEnvVars,
} from './helpers/parseArgsAndEnvVars';
import {
  type ServerApplicationContext,
  createApplicationContext,
} from '@web-api/applicationContext';
import { getCaseByDocketNumber } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import fs from 'fs';

const scriptConfig: ScriptConfig = {
  description:
    'download-all-case-documents - Downloads all docket entries for the given docket number.',
  environment: {
    dynamoDbTableName: 'DYNAMODB_TABLE_NAME',
    efcmsDomain: 'EFCMS_DOMAIN',
    env: 'ENV',
  },
  parameters: {
    docketNumber: {
      position: 0,
      required: true,
      type: 'string',
    },
  },
  requireActiveAwsSession: true,
};
const { docketNumber } = parseArgsAndEnvVars(scriptConfig) as {
  docketNumber: string;
};

const OUTPUT_DIR = `${process.env.HOME}/Downloads/${docketNumber}`;

const downloadPdf = async ({
  applicationContext,
  docketEntryId,
  filename,
  path,
}: {
  applicationContext: ServerApplicationContext;
  docketEntryId: string;
  filename: string;
  path: string;
}): Promise<void> => {
  console.log(`BEGIN --- ${filename}`);

  // download pdf from S3
  const data = await applicationContext.getStorageClient().getObject({
    Bucket: applicationContext.environment.documentsBucketName,
    Key: docketEntryId,
  });
  if (data && 'Body' in data && data.Body) {
    // @ts-ignore
    await fs.promises.writeFile(`${path}/${filename}`, data.Body);
    console.log(`COMPLETE --- ${filename}`);
  } else {
    console.error(`ERROR --- ${filename}`);
  }
};

const generateFilename = ({
  caseCaption,
  docketEntry: { documentType, index },
}: {
  caseCaption: string;
  docketEntry: { documentType: string; index: number };
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
    docketNumber,
  });
  let numSealed = 0;
  let numError = 0;
  for (const docketEntryRaw of caseEntity.docketEntries) {
    const docketEntry = new DocketEntry(docketEntryRaw, {
      authorizedUser: undefined,
    });
    if (!docketEntry.isFileAttached || !docketEntry.index) {
      console.log('did not download docket entry', docketEntry);
      continue;
    }
    const sealed =
      docketEntry.isSealed ||
      docketEntry.isLegacySealed ||
      docketEntry.documentTitle.indexOf('(SEALED)') > -1 ||
      // @ts-ignore
      docketEntry.additionalInfo2?.indexOf('(SEALED)') > -1;
    if (sealed) {
      numSealed++;
    }
    try {
      const filename = generateFilename({
        caseCaption: caseEntity.caseCaption,
        // @ts-ignore
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
