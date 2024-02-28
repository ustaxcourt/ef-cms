// usage: npx ts-node --transpile-only scripts/upload-practitioner-application-packages.ts > "$HOME/Documents/upload/stats-$(date +%s).txt"

import { DateTime } from 'luxon';
import { createApplicationContext } from '@web-api/applicationContext';
import { createISODateString } from '@shared/business/utilities/DateHandler';
import { extname, parse } from 'path';
import { requireEnvVars } from '../shared/admin-tools/util';
import { searchAll } from '@web-api/persistence/elasticsearch/searchClient';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import tiff2pdf from 'tiff2pdf';
import type { RawPractitioner } from '@shared/business/entities/Practitioner';

requireEnvVars(['ENV', 'HOME', 'REGION']);

const INPUT_DIR = `${process.env.HOME}/Documents/upload`;
const MAX_TRIES = 5;
const DYNAMODB_CHUNK_SIZE = 25;

type putRequestType = { PutRequest: { Item: { [key: string]: string } } };
type fileType = { fileId: string; fileName: string };

const uploadDir = `${INPUT_DIR}/to-upload`;
const completedDir = `${INPUT_DIR}/done/uploaded`;
const ddbEntities: putRequestType[] = [];
const output = {
  completed: {
    conversion: {} as { [key: string]: string },
    uploadToS3: {} as { [key: string]: fileType },
    writeToDynamoDB: {} as { [key: string]: fileType },
  },
  failed: {
    conversion: {} as { [key: string]: string },
    practitionerNotFound: [] as string[],
    uploadToS3: {} as { [key: string]: { fileId: string; fileName: string } },
    writeToDynamoDB: {
      error: [] as putRequestType[],
      unprocessed: [] as putRequestType[],
    },
  },
};

const getAllBarNumbers = async ({
  applicationContext,
}: {
  applicationContext: IApplicationContext;
}): Promise<string[]> => {
  const { results } = await searchAll({
    applicationContext,
    searchParameters: {
      body: {
        _source: ['barNumber.S'],
        query: {
          bool: {
            filter: {
              exists: {
                field: 'barNumber.S',
              },
            },
          },
        },
      },
      index: 'efcms-user',
    },
  });
  return results.map((practitioner: RawPractitioner) => practitioner.barNumber);
};

const uploadDocumentToS3 = async ({
  applicationContext,
  fileId,
  filePath,
}: {
  applicationContext: IApplicationContext;
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
      await applicationContext
        .getStorageClient()
        .putObject({
          Body: fileData,
          Bucket: applicationContext.environment.documentsBucketName,
          ContentType: 'application/pdf',
          Key: fileId,
        })
        .promise();
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
  applicationContext: IApplicationContext;
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
    ddbEntities.push({
      PutRequest: {
        Item: {
          categoryName: 'Application Package',
          categoryType: 'Application Package',
          description: 'Imported from Blackstone',
          entityName: 'Document',
          fileName,
          pk: `practitioner|${barNumber.toLowerCase()}`,
          practitionerDocumentFileId,
          sk: `document|${practitionerDocumentFileId}`,
          uploadDate: createISODateString(),
        },
      },
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
          reject();
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
        reject();
      } else {
        resolve(true);
      }
    });
  });
};

const getBarNumberFromPractitionerDocumentPk = ({
  pk,
}: {
  pk: string;
}): string => {
  return pk.replace('practitioner|', '').toUpperCase();
};

const uploadChunkToS3 = async ({
  applicationContext,
  chunk,
}: {
  applicationContext: IApplicationContext;
  chunk: putRequestType[];
}): Promise<void> => {
  await Promise.all(
    chunk.map(doc => {
      const barNumber = getBarNumberFromPractitionerDocumentPk({
        pk: doc.PutRequest.Item.pk,
      });
      const { fileName, practitionerDocumentFileId: fileId } =
        doc.PutRequest.Item;
      return uploadFileAndMoveOriginal({
        applicationContext,
        barNumber,
        fileId,
        fileName,
      });
    }),
  );
};

const writeChunkToDynamoDb = async ({
  applicationContext,
  chunk,
}: {
  applicationContext: IApplicationContext;
  chunk: putRequestType[];
}): Promise<void> => {
  const { dynamoDbTableName } = applicationContext.environment;
  let unprocessedItems = { [dynamoDbTableName]: chunk };
  let tries = 0;
  while (
    unprocessedItems &&
    Object.keys(unprocessedItems).length > 0 &&
    tries < MAX_TRIES
  ) {
    try {
      const batchWriteParams = { RequestItems: unprocessedItems };
      const res = await applicationContext
        .getDocumentClient(applicationContext)
        .batchWrite(batchWriteParams)
        .promise();
      unprocessedItems = res.UnprocessedItems;
    } catch (err) {
      output.failed.writeToDynamoDB.error.push(...chunk);
    }
    tries++;
  }
  if (unprocessedItems && dynamoDbTableName in unprocessedItems) {
    output.failed.writeToDynamoDB.unprocessed.push(
      ...unprocessedItems[dynamoDbTableName],
    );
  }
  const failedWrites = output.failed.writeToDynamoDB.error.map(
    doc => doc.PutRequest.Item.practitionerDocumentFileId,
  );
  const unprocessedWrites = output.failed.writeToDynamoDB.unprocessed.map(
    doc => doc.PutRequest.Item.practitionerDocumentFileId,
  );
  for (const doc of chunk) {
    const barNumber = getBarNumberFromPractitionerDocumentPk({
      pk: doc.PutRequest.Item.pk,
    });
    const { fileName, practitionerDocumentFileId: fileId } =
      doc.PutRequest.Item;
    if (!failedWrites.includes(fileId) && !unprocessedWrites.includes(fileId)) {
      output.completed.writeToDynamoDB[barNumber] = {
        fileId,
        fileName,
      };
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
    `Number of documents inserted into DynamoDB: ${
      Object.keys(output.completed.writeToDynamoDB).length
    }`,
  );
  console.log(
    'Number of documents that could not be inserted into DynamoDB due to ' +
      `error: ${output.failed.writeToDynamoDB.error.length}`,
  );
  console.log(
    'Number of documents that could not be inserted into DynamoDB due to ' +
      `exceeding maximum tries: ${output.failed.writeToDynamoDB.unprocessed.length}`,
  );
  console.log('');
};

const batchUploadPractitionerApplicationPackages = async ({
  applicationContext,
}: {
  applicationContext: IApplicationContext;
}): Promise<void> => {
  console.time('Total execution time');
  const fileNames = fs.readdirSync(uploadDir);
  if (!fileNames || fileNames.length === 0) {
    console.error('Nothing to import!');
    console.timeEnd('Total execution time');
    return;
  }

  console.time('Duration of retrieval of practitioner records');
  const allBarNumbers = await getAllBarNumbers({ applicationContext });
  console.timeEnd('Duration of retrieval of practitioner records');

  console.time('Duration of conversion from .tif to .pdf');
  await convertAllTifsAndConstructDocumentEntities({
    allBarNumbers,
    fileNames,
  });
  console.timeEnd('Duration of conversion from .tif to .pdf');

  console.time('Duration of file upload and document creation');
  for (let i = 0; i < ddbEntities.length; i += DYNAMODB_CHUNK_SIZE) {
    let chunk = ddbEntities.slice(i, i + DYNAMODB_CHUNK_SIZE);
    const chunkItems = `${i + 1}-${i + chunk.length}`;

    console.time(`Duration of upload of items ${chunkItems} to S3`);
    await uploadChunkToS3({ applicationContext, chunk });
    const failedUploads = Object.values(output.failed.uploadToS3).map(
      f => f.fileId,
    );
    chunk = chunk.filter(
      doc =>
        !failedUploads.includes(doc.PutRequest.Item.practitionerDocumentFileId),
    );
    console.timeEnd(`Duration of upload of items ${chunkItems} to S3`);

    console.time(`Duration of creation of documents ${chunkItems} in dynamodb`);
    await writeChunkToDynamoDb({ applicationContext, chunk });
    console.timeEnd(
      `Duration of creation of documents ${chunkItems} in dynamodb`,
    );
  }
  console.timeEnd('Duration of file upload and document creation');

  const now = DateTime.now().toUnixInteger();
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
