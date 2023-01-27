// usage: npx ts-node shared/admin-tools/upload-practitioner-application-packages.js > "$HOME/Documents/upload/stats-$(date +%s).txt"

const { requireEnvVars } = require('./util');
requireEnvVars(['ENV', 'HOME', 'REGION']);

const createApplicationContext = require('../../web-api/src/applicationContext');
const fs = require('fs');
const tiff2pdf = require('tiff2pdf');
const {
  createISODateString,
} = require('../src/business/utilities/DateHandler');
const { DateTime } = require('luxon');
const { extname, parse } = require('path');
const { searchAll } = require('../src/persistence/elasticsearch/searchClient');
const { v4: uuidv4 } = require('uuid');

const INPUT_DIR = `${process.env.HOME}/Documents/upload`;

const getAllPractitioners = async ({ applicationContext }) => {
  const { results } = await searchAll({
    applicationContext,
    searchParameters: {
      body: {
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
  return results;
};

const uploadDocumentToS3 = async ({ applicationContext, fileId, filePath }) => {
  const fileData = fs.readFileSync(filePath);
  if (!fileData) {
    return;
  }
  return await applicationContext
    .getStorageClient()
    .putObject({
      Body: fileData,
      Bucket: applicationContext.environment.documentsBucketName,
      ContentType: 'application/pdf',
      Key: fileId,
    })
    .promise();
};

const convertTifToPdf = async ({ fileName }) => {
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

const batchUploadPractitionerApplicationPackages = async ({
  applicationContext,
}) => {
  console.time('Total execution time');
  const uploadDir = `${INPUT_DIR}/to-upload`;
  const completedDir = `${INPUT_DIR}/done/uploaded`;
  const fileNames = fs.readdirSync(uploadDir);
  if (!fileNames || fileNames.length === 0) {
    return;
  }
  const { dynamoDbTableName } = applicationContext.environment;
  const ddbEntities = [];
  const completed = { conversion: {}, dynamoDocument: {}, uploadToS3: {} };
  const failed = {
    conversion: {},
    dynamoDocument: { error: [], unprocessed: [] },
    practitionerNotFound: [],
    uploadToS3: {},
  };

  console.time('Duration of retrieval of practitioner records');
  const allPractitioners = await getAllPractitioners({ applicationContext });
  console.timeEnd('Duration of retrieval of practitioner records');

  console.time('Duration of conversion from .tif to .pdf');
  for (let fileName of fileNames) {
    if (['.DS_Store', '__MACOSX'].includes(fileName)) {
      continue;
    }
    let filePath = `${uploadDir}/${fileName}`;
    const barNumber = parse(filePath).name.toUpperCase();
    if (extname(fileName).toLowerCase() === '.tif') {
      const convertedFileName = await convertTifToPdf({ fileName });
      if (!convertedFileName) {
        failed.conversion[barNumber] = fileName;
        continue;
      }
      fileName = convertedFileName;
      filePath = `${uploadDir}/${fileName}`;
      completed.conversion[barNumber] = fileName;
    }
    if (!allPractitioners.filter(p => p.barNumber === barNumber).length) {
      failed.practitionerNotFound.push(barNumber);
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
  console.timeEnd('Duration of conversion from .tif to .pdf');

  console.time('Duration of file upload and document creation');
  const ddbChunkSize = 25;
  for (let i = 0; i < ddbEntities.length; i += ddbChunkSize) {
    const chunk = ddbEntities.slice(i, i + ddbChunkSize);
    const chunkItems = `${i}-${i + chunk.length}`;
    console.time(`Duration of upload of items ${chunkItems} to S3`);
    for (const practitionerDocument of chunk) {
      const barNumber = getBarNumberFromPractitionerDocumentPk({
        pk: practitionerDocument.PutRequest.Item.pk,
      });
      const { fileName, practitionerDocumentFileId: fileId } =
        practitionerDocument.PutRequest.Item;
      const uploaded = await uploadDocumentToS3({
        applicationContext,
        fileId,
        filePath: `${uploadDir}/${fileName}`,
      });
      if (!uploaded) {
        failed.uploadToS3[barNumber] = {
          fileId,
          fileName,
        };
        continue;
      }
      completed.uploadToS3[barNumber] = {
        fileId,
        fileName,
      };
      await moveLocalFile({
        newPath: `${completedDir}/${fileName}`,
        oldPath: `${uploadDir}/${fileName}`,
      });
    }
    console.timeEnd(`Duration of upload of items ${chunkItems} to S3`);
    console.time(`Duration of creation of documents ${chunkItems} in dynamodb`);
    const batchWriteParams = {
      RequestItems: {
        [dynamoDbTableName]: chunk,
      },
    };
    await applicationContext
      .getDocumentClient()
      .batchWrite(batchWriteParams, async (err, data) => {
        if (err) {
          failed.dynamoDocument.error.push(chunk);
        } else {
          if (
            data &&
            'UnprocessedItems' in data &&
            Object.keys(data.UnprocessedItems).length > 0
          ) {
            let unprocessedItems = data.UnprocessedItems;
            const maxRetries = 5;
            let retries = 0;
            while (
              unprocessedItems &&
              Object.keys(unprocessedItems).length > 0 &&
              retries < maxRetries
            ) {
              const retryParams = { RequestItems: unprocessedItems };
              const retryOutput = await applicationContext
                .getDocumentClient()
                .batchWrite(retryParams)
                .promise();
              unprocessedItems = retryOutput.UnprocessedItems;
              retries++;
            }
            if (unprocessedItems && dynamoDbTableName in unprocessedItems) {
              failed.dynamoDocument.unprocessed.push(
                unprocessedItems[dynamoDbTableName],
              );
            }
          }
          for (const doc of chunk) {
            const barNumber = getBarNumberFromPractitionerDocumentPk({
              pk: doc.PutRequest.Item.pk,
            });
            const { fileName, practitionerDocumentFileId: fileId } =
              doc.PutRequest.Item;
            completed.dynamoDocument[barNumber] = {
              fileId,
              fileName,
            };
          }
        }
      })
      .promise();
    console.timeEnd(
      `Duration of creation of documents ${chunkItems} in dynamodb`,
    );
  }
  console.timeEnd('Duration of file upload and document creation');

  const output = { completed, failed };
  const now = DateTime.now().toUnixInteger();
  const outputFilePath = `${INPUT_DIR}/results-${now}.json`;
  fs.writeFileSync(outputFilePath, JSON.stringify(output));
  console.timeEnd('Total execution time');

  console.log('');
  console.log(
    `Number of files converted from .tif to .pdf: ${
      Object.keys(completed.conversion).length
    }`,
  );
  console.log(
    `Number of files that failed to convert from .tif to .pdf: ${
      Object.keys(failed.conversion).length
    }`,
  );
  console.log(
    'Number of files not uploaded because the bar number could not ' +
      `be found: ${failed.practitionerNotFound.length}`,
  );
  console.log(
    `Number of files uploaded to S3: ${
      Object.keys(completed.uploadToS3).length
    }`,
  );
  console.log(
    `Number of files that failed to upload to S3: ${
      Object.keys(failed.uploadToS3).length
    }`,
  );
  console.log(
    `Number of documents inserted into DynamoDB: ${
      Object.keys(completed.dynamoDocument).length
    }`,
  );
  console.log(
    'Number of documents that could not be inserted into DynamoDB due to ' +
      `error: ${failed.dynamoDocument.error.length}`,
  );
  console.log(
    'Number of documents that could not be inserted into DynamoDB due to ' +
      `exceeding maximum tries: ${failed.dynamoDocument.unprocessed.length}`,
  );
};

(async () => {
  const applicationContext = createApplicationContext({});
  await batchUploadPractitionerApplicationPackages({ applicationContext });
})();
