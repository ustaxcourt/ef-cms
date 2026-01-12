#!/usr/bin/env -S npx ts-node --transpile-only

// usage: ./scripts/upload-practitioner-application-packages.ts > "$HOME/Documents/upload/stats-$(date +%s).txt"

import type { RawPractitioner } from '@shared/business/entities/Practitioner';
import {
  type ScriptConfig,
  parseArgsAndEnvVars,
} from './helpers/parseArgsAndEnvVars';
import {
  type ServerApplicationContext,
  createApplicationContext,
} from '@web-api/applicationContext';
import { PractitionerDocumentTable } from '@web-api/persistence/postgres/practitionerDocuments/schema';
import {
  createISODateString,
  formatNow,
  FORMATS,
} from '@shared/business/utilities/DateHandler';
import { extname, parse } from 'path';
import { fromKyselyUser } from '@web-api/persistence/postgres/users/mapper';
import { getDbReader } from '@web-api/database';
import { pgInsertInto } from '@web-api/persistence/postgres/utils/operation/pgInsertInto';
import { toKyselyNewPractitionerDocument } from '@web-api/persistence/postgres/practitionerDocuments/mapper';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import tiff2pdf from 'tiff2pdf';

const scriptConfig: ScriptConfig = {
  description:
    'upload-practitioner-application-packages - Converts files named ' +
    '<bar number>.tif to PDF, uploads them to S3, and inserts ' +
    'corresponding Document entities into postgres.',
  environment: {
    efcmsDomain: 'EFCMS_DOMAIN',
    env: 'ENV',
    home: 'HOME',
  },
  requireActiveAwsSession: true,
};
const { home } = parseArgsAndEnvVars(scriptConfig) as { home: string };

const INPUT_DIR = `${home}/Documents/upload`;
const MAX_TRIES = 5;
const CHUNK_SIZE = 25;

type fileType = { fileId: string; fileName: string };

const uploadDir = `${INPUT_DIR}/to-upload`;
const completedDir = `${INPUT_DIR}/done/uploaded`;
const postgresEntities: PractitionerDocumentTable[] = [];
const output = {
  completed: {
    conversion: {} as { [key: string]: string },
    uploadToS3: {} as { [key: string]: fileType },
    writeToPostgres: {} as { [key: string]: fileType },
  },
  failed: {
    conversion: {} as { [key: string]: string },
    practitionerNotFound: [] as string[],
    uploadToS3: {} as { [key: string]: { fileId: string; fileName: string } },
    writeToPostgres: {
      error: [] as PractitionerDocumentTable[],
      unprocessed: [] as PractitionerDocumentTable[],
    },
  },
};

const getAllBarNumbers = async (): Promise<string[]> => {
  const results = (
    await getDbReader(reader =>
      reader
        .selectFrom('dwUser as u')
        .selectAll('u')
        .where('u.barNumber', 'is not', null)
        .orderBy('u.admissionsDate', 'asc')
        .execute(),
    )
  ).map(fromKyselyUser) as RawPractitioner[];
  return results.map((practitioner: RawPractitioner) => practitioner.barNumber);
};

const uploadDocumentToS3 = async ({
  applicationContext,
  fileId,
  filePath,
}: {
  applicationContext: ServerApplicationContext;
  fileId: string;
  filePath: string;
}): Promise<boolean> => {
  const fileData = fs.readFileSync(filePath);
  if (!fileData) {
    return false;
  }

  let uploaded = false;
  let tries = 0;
  while (!uploaded && tries < MAX_TRIES) {
    try {
      await applicationContext.getStorageClient().putObject({
        Body: fileData,
        Bucket: applicationContext.environment.documentsBucketName,
        ContentType: 'application/pdf',
        Key: fileId,
      });
      uploaded = true;
    } catch (err) {
      if (
        err &&
        typeof err === 'object' &&
        'retryable' in err &&
        !err.retryable
      ) {
        tries = MAX_TRIES;
      }
    }
    tries++;
  }

  return uploaded;
};

const uploadFileAndMoveOriginal = async ({
  applicationContext,
  barNumber,
  fileId,
  fileName,
}: {
  applicationContext: ServerApplicationContext;
  barNumber: string;
  fileId: string;
  fileName: string;
}): Promise<boolean> => {
  const uploaded = await uploadDocumentToS3({
    applicationContext,
    fileId,
    filePath: `${uploadDir}/${fileName}`,
  });
  if (!uploaded) {
    output.failed.uploadToS3[barNumber] = {
      fileId,
      fileName,
    };
  } else {
    output.completed.uploadToS3[barNumber] = {
      fileId,
      fileName,
    };
    await moveLocalFile({
      newPath: `${completedDir}/${fileName}`,
      oldPath: `${uploadDir}/${fileName}`,
    });
  }
  return uploaded;
};

const convertAllTifsAndConstructDocumentEntities = async ({
  allBarNumbers,
  fileNames,
}: {
  allBarNumbers: string[];
  fileNames: string[];
}): Promise<void> => {
  for (let fileName of fileNames) {
    if (['.DS_Store', '__MACOSX'].includes(fileName)) {
      continue;
    }
    let filePath = `${uploadDir}/${fileName}`;
    const barNumber = parse(filePath).name.toUpperCase();
    if (extname(fileName).toLowerCase() === '.tif') {
      const convertedFileName = await convertTifToPdfAndMoveOriginal({
        fileName,
      });
      if (!convertedFileName) {
        output.failed.conversion[barNumber] = fileName;
        continue;
      }
      fileName = convertedFileName;
      filePath = `${uploadDir}/${fileName}`;
      output.completed.conversion[barNumber] = fileName;
    }
    if (!allBarNumbers.includes(barNumber)) {
      output.failed.practitionerNotFound.push(barNumber);
      continue;
    }
    const practitionerDocumentFileId = uuidv4();
    postgresEntities.push({
      categoryName: 'Application Package',
      categoryType: 'Application Package',
      description: 'Imported from Blackstone',
      fileName,
      barNumber,
      practitionerDocumentFileId,
      uploadDate: createISODateString(),
      location: '',
    });
  }
};

const convertTifToPdfAndMoveOriginal = async ({
  fileName,
}: {
  fileName: string;
}): Promise<string | undefined> => {
  const outputDir = `${INPUT_DIR}/to-upload`;
  const convertedDir = `${INPUT_DIR}/done/original`;
  const converted = await asyncTifToPdf({ fileName, outputDir });
  if (!converted) {
    return;
  }
  const filePath = `${outputDir}/${fileName}`;
  const newFileNameWithoutExt = parse(filePath).name;
  await moveLocalFile({
    newPath: `${convertedDir}/${newFileNameWithoutExt}.tif`,
    oldPath: filePath,
  });
  return `${newFileNameWithoutExt}.pdf`;
};

const asyncTifToPdf = ({
  fileName,
  outputDir,
}: {
  fileName: string;
  outputDir: string;
}): Promise<string> => {
  const filePath = `${outputDir}/${fileName}`;
  return new Promise((resolve, reject) => {
    tiff2pdf(filePath, outputDir, result => {
      if ('message' in result && ['close', 'error'].includes(result.message)) {
        if (result.code === 0) {
          resolve(fileName);
        } else {
          reject(new Error('Unable convert tif to pdf'));
        }
      }
    });
  });
};

const moveLocalFile = async ({
  newPath,
  oldPath,
}: {
  newPath: string;
  oldPath: string;
}): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    fs.rename(oldPath, newPath, err => {
      if (err) {
        console.error(err);
        reject(new Error('unable to moveLocalFile'));
      } else {
        resolve(true);
      }
    });
  });
};

const uploadChunkToS3 = async ({
  applicationContext,
  chunk,
}: {
  applicationContext: ServerApplicationContext;
  chunk: PractitionerDocumentTable[];
}): Promise<void> => {
  await Promise.all(
    chunk.map(doc => {
      const barNumber = doc.barNumber.toUpperCase();
      const { fileName, practitionerDocumentFileId: fileId } = doc;
      return uploadFileAndMoveOriginal({
        applicationContext,
        barNumber,
        fileId,
        fileName,
      });
    }),
  );
};

const writeChunkToPostgres = async ({
  chunk,
}: {
  chunk: PractitionerDocumentTable[];
}): Promise<void> => {
  const failedWrites: string[] = [];

  for (const doc of chunk) {
    const {
      fileName,
      practitionerDocumentFileId,
      barNumber,
      categoryName,
      categoryType,
      description,
      uploadDate,
      location,
    } = doc;

    const practitionerDocument = {
      practitionerDocumentFileId,
      fileName,
      barNumber,
      categoryName,
      categoryType,
      description,
      uploadDate,
      location,
    };

    try {
      await pgInsertInto({
        table: 'dwPractitionerDocuments',
        values: toKyselyNewPractitionerDocument(
          practitionerDocument,
          barNumber,
        ),
        onConflictColumns: ['practitionerDocumentFileId'],
      });

      const barNum = barNumber.toUpperCase();
      output.completed.writeToPostgres[barNum] = {
        fileId: practitionerDocumentFileId,
        fileName,
      };
    } catch (err) {
      console.error('Failed to insert:', practitionerDocumentFileId, err);
      failedWrites.push(practitionerDocumentFileId);
      output.failed.writeToPostgres.error.push(doc);
    }
  }

  // Track unprocessed if needed (you could add retry logic here too)
  for (const doc of chunk) {
    const fileId = doc.practitionerDocumentFileId;
    if (failedWrites.includes(fileId)) {
      output.failed.writeToPostgres.unprocessed.push(doc);
    }
  }
};

const outputStatistics = (): void => {
  console.log('');
  console.log(
    `Number of files converted from .tif to .pdf: ${
      Object.keys(output.completed.conversion).length
    }`,
  );
  console.log(
    `Number of files that failed to convert from .tif to .pdf: ${
      Object.keys(output.failed.conversion).length
    }`,
  );
  console.log(
    'Number of files not uploaded because the bar number could not ' +
      `be found: ${output.failed.practitionerNotFound.length}`,
  );
  console.log(
    `Number of files uploaded to S3: ${
      Object.keys(output.completed.uploadToS3).length
    }`,
  );
  console.log(
    `Number of files that failed to upload to S3: ${
      Object.keys(output.failed.uploadToS3).length
    }`,
  );
  console.log(
    `Number of documents inserted into postgres: ${
      Object.keys(output.completed.writeToPostgres).length
    }`,
  );
  console.log(
    'Number of documents that could not be inserted into postgres due to ' +
      `error: ${output.failed.writeToPostgres.error.length}`,
  );
  console.log(
    'Number of documents that could not be inserted into postgres due to ' +
      `exceeding maximum tries: ${output.failed.writeToPostgres.unprocessed.length}`,
  );
  console.log('');
};

const batchUploadPractitionerApplicationPackages = async ({
  applicationContext,
}: {
  applicationContext: ServerApplicationContext;
}): Promise<void> => {
  console.time('Total execution time');
  const fileNames = fs.readdirSync(uploadDir);
  if (!fileNames || fileNames.length === 0) {
    console.error('Nothing to import!');
    console.timeEnd('Total execution time');
    return;
  }

  console.time('Duration of retrieval of practitioner records');
  const allBarNumbers = await getAllBarNumbers();
  console.timeEnd('Duration of retrieval of practitioner records');

  console.time('Duration of conversion from .tif to .pdf');
  await convertAllTifsAndConstructDocumentEntities({
    allBarNumbers,
    fileNames,
  });
  console.timeEnd('Duration of conversion from .tif to .pdf');

  console.time('Duration of file upload and document creation');
  for (let i = 0; i < postgresEntities.length; i += CHUNK_SIZE) {
    let chunk = postgresEntities.slice(i, i + CHUNK_SIZE);
    const chunkItems = `${i + 1}-${i + chunk.length}`;

    console.time(`Duration of upload of items ${chunkItems} to S3`);
    await uploadChunkToS3({ applicationContext, chunk });
    const failedUploads = Object.values(output.failed.uploadToS3).map(
      f => f.fileId,
    );
    chunk = chunk.filter(
      doc => !failedUploads.includes(doc.practitionerDocumentFileId),
    );
    console.timeEnd(`Duration of upload of items ${chunkItems} to S3`);

    console.time(`Duration of creation of documents ${chunkItems} in postgres`);
    await writeChunkToPostgres({ chunk });
    console.timeEnd(
      `Duration of creation of documents ${chunkItems} in postgres`,
    );
  }
  console.timeEnd('Duration of file upload and document creation');

  const now = Number(formatNow(FORMATS.UNIX_TIMESTAMP_SECONDS));
  const outputFilePath = `${INPUT_DIR}/results-${now}.json`;
  fs.writeFileSync(outputFilePath, JSON.stringify(output));
  outputStatistics();

  console.timeEnd('Total execution time');
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const applicationContext = createApplicationContext({});
  await batchUploadPractitionerApplicationPackages({ applicationContext });
})();
