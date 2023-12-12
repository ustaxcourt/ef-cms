// usage: npx ts-node --transpile-only shared/admin-tools/upload-practitioner-application-packages.js > "$HOME/Documents/upload/stats-$(date +%s).txt"

const { requireEnvVars } = require('./util');
requireEnvVars(['ENV', 'HOME', 'REGION']);

const fs = require('fs');
const tiff2pdf = require('tiff2pdf');
const {
  createApplicationContext,
} = require('../../web-api/src/applicationContext');
const {
  createISODateString,
} = require('../src/business/utilities/DateHandler');
const {
  searchAll,
} = require('../../web-api/src/persistence/elasticsearch/searchClient');
const { DateTime } = require('luxon');
const { extname, parse } = require('path');
const { v4: uuidv4 } = require('uuid');

const INPUT_DIR = `${process.env.HOME}/Documents/upload`;
const MAX_TRIES = 5;
const DYNAMODB_CHUNK_SIZE = 25;

const uploadDir = `${INPUT_DIR}/to-upload`;
const completedDir = `${INPUT_DIR}/done/uploaded`;
const ddbEntities = [];
const output = {
  completed: {
    conversion: {},
    uploadToS3: {},
    writeToDynamoDB: {},
  },
  failed: {
    conversion: {},
    practitionerNotFound: [],
    uploadToS3: {},
    writeToDynamoDB: {
      error: [],
      unprocessed: [],
    },
  },
};

const getAllBarNumbers = async ({ applicationContext }) => {
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
  return results.map(practitioner => practitioner.barNumber);
};

const uploadDocumentToS3 = async ({ applicationContext, fileId, filePath }) => {
  const fileData = fs.readFileSync(filePath);
  if (!fileData) {
    return;
  }

  let uploaded = false;
  let tries = 0;
  while (!uploaded && tries < MAX_TRIES) {
    try {
      uploaded = await applicationContext
        .getStorageClient()
        .putObject({
          Body: fileData,
          Bucket: applicationContext.environment.documentsBucketName,
          ContentType: 'application/pdf',
          Key: fileId,
        })
        .promise();
    } catch (err) {
      if (err && 'retryable' in err && !err.retryable) {
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
}) => {
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
}) => {
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

const convertTifToPdfAndMoveOriginal = async ({ fileName }) => {
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

const asyncTifToPdf = ({ fileName, outputDir }) => {
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

const moveLocalFile = async ({ newPath, oldPath }) => {
  return new Promise((resolve, reject) => {
    fs.rename(oldPath, newPath, err => {
      if (err) {
        reject();
      } else {
        resolve();
      }
    });
  });
};

const getBarNumberFromPractitionerDocumentPk = ({ pk }) => {
  return pk.replace('practitioner|', '').toUpperCase();
};

const uploadChunkToS3 = async ({ applicationContext, chunk }) => {
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

const writeChunkToDynamoDb = async ({ applicationContext, chunk }) => {
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

const outputStatistics = () => {
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
}) => {
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

(async () => {
  const applicationContext = createApplicationContext({});
  await batchUploadPractitionerApplicationPackages({ applicationContext });
})();
