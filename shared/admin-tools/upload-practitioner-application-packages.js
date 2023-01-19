// usage: npx ts-node shared/admin-tools/upload-practitioner-application-packages.js

const { requireEnvVars } = require('./util');
requireEnvVars(['ENV', 'HOME', 'REGION']);

const createApplicationContext = require('../../web-api/src/applicationContext');
const fs = require('fs');
const tiff2pdf = require('tiff2pdf');
const {
  MAX_SEARCH_CLIENT_RESULTS,
} = require('../src/business/entities/EntityConstants');
const { extname, parse } = require('path');
const { search } = require('../src/persistence/elasticsearch/searchClient');
const { v4: uuidv4 } = require('uuid');

const INPUT_DIR = `${process.env.HOME}/Documents/upload`;

const getUserIdByBarNumber = async ({ applicationContext, barNumber }) => {
  const { results } = await search({
    applicationContext,
    searchParameters: {
      body: {
        from: 0,
        query: {
          bool: {
            must: {
              term: {
                'barNumber.S': {
                  value: barNumber,
                },
              },
            },
          },
        },
        size: MAX_SEARCH_CLIENT_RESULTS,
      },
      index: 'efcms-user',
    },
  });
  return results[0]?.userId;
};

const createPractitionerDocument = async ({
  applicationContext,
  barNumber,
  fileName,
  filePath,
}) => {
  const fileId = uuidv4();
  await uploadDocumentToS3({
    applicationContext,
    fileId,
    filePath,
  });

  await createPractitionerDocumentEntity({
    applicationContext,
    barNumber,
    fileId,
    fileName,
  });
};

const uploadDocumentToS3 = async ({ applicationContext, fileId, filePath }) => {
  return fs.readFile(filePath, async (err, fileData) => {
    return await applicationContext
      .getStorageClient()
      .putObject({
        Body: fileData,
        Bucket: applicationContext.environment.documentsBucketName,
        ContentType: 'application/pdf',
        Key: fileId,
      })
      .promise();
  });
};

const createPractitionerDocumentEntity = async ({
  applicationContext,
  barNumber,
  fileId,
  fileName,
}) => {
  return await applicationContext
    .getDocumentClient()
    .put({
      Item: {
        categoryName: 'Application Package',
        categoryType: 'Application Package',
        description: 'Imported from Blackstone',
        entityName: 'Document',
        fileName,
        pk: `practitioner|${barNumber.toLowerCase()}`,
        practitionerDocumentFileId: fileId,
        sk: `document|${fileId}`,
        uploadDate: 'foo',
      },
      TableName: applicationContext.environment.dynamoDbTableName,
    })
    .promise();
};

const convertTiffToPdf = async ({ fileName }) => {
  const outputDir = `${INPUT_DIR}/to-upload`;
  const convertedDir = `${INPUT_DIR}/done/converted`;
  const converted = await asyncTiffToPdf({ fileName, outputDir });
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

const asyncTiffToPdf = ({ fileName, outputDir }) => {
  const filePath = `${outputDir}/${fileName}`;
  return new Promise((resolve, reject) => {
    tiff2pdf(filePath, outputDir, result => {
      if ('message' in result && ['close', 'error'].includes(result.message)) {
        if (result.code === 0) {
          resolve(fileName);
        } else {
          console.error(`Unable to convert ${filePath}`);
          reject();
        }
      }
    });
  });
};

const moveLocalFile = async ({ newPath, oldPath }) => {
  await fs.rename(oldPath, newPath, err => {
    if (err) {
      console.error(`Unable to move ${oldPath}:`, err);
    }
  });
};

const batchUploadPractitionerApplicationPackages = async ({
  applicationContext,
}) => {
  const uploadDir = `${INPUT_DIR}/to-upload`;
  const completedDir = `${INPUT_DIR}/done/uploaded`;
  await fs.readdir(uploadDir, async (err, fileNames) => {
    for (let fileName of fileNames) {
      if (['.DS_Store', '__MACOSX'].includes(fileName)) {
        continue;
      }
      let filePath = `${uploadDir}/${fileName}`;
      const barNumber = parse(filePath).name.toUpperCase();
      if (['.tif', '.tiff'].includes(extname(fileName).toLowerCase())) {
        fileName = await convertTiffToPdf({ fileName });
        filePath = `${uploadDir}/${fileName}`;
        if (!fileName) {
          continue;
        }
      }
      const userId = await getUserIdByBarNumber({
        applicationContext,
        barNumber,
      });
      if (!userId) {
        console.error(
          `Unable to determine userId for practitioner ${barNumber}`,
        );
        continue;
      }
      await createPractitionerDocument({
        applicationContext,
        barNumber,
        fileName,
        filePath,
      });
      await moveLocalFile({
        newPath: `${completedDir}/${fileName}`,
        oldPath: filePath,
      });
      console.log(
        `Successfully imported admissions application package for practitioner ${barNumber}`,
      );
    }
  });
};

(async () => {
  const applicationContext = createApplicationContext({});
  await batchUploadPractitionerApplicationPackages({ applicationContext });
})();
