/**
 * okay this script is to remove a page from a PDF for a special request
 */

if (!process.argv[2] || !process.argv[3]) {
  console.log('please specify a docketNumber and docketEntryId');
  console.log('');
  console.log('$ node remove-first-page.js [docketNumber] [docketEntryId]');
  process.exit();
}

const createApplicationContext = require('../../../web-api/src/applicationContext');
const fs = require('fs');
const {
  removeCoverFromPdf,
} = require('../../src/business/useCaseHelper/coverSheets/removeCoversheet');
const { Case } = require('../../src/business/entities/cases/Case');

const getPdfBody = async (applicationContext, { docketEntryId }) => {
  const params = {
    Bucket: applicationContext.environment.documentsBucketName,
    Key: docketEntryId,
  };
  console.log(params);
  const { Body } = await applicationContext
    .getStorageClient()
    .getObject(params)
    .promise();
  return Body;
};

(async () => {
  const applicationContext = createApplicationContext({});

  const docketNumber = process.argv[2];
  const docketEntryId = process.argv[3];

  const caseRecord = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({
      applicationContext,
      docketNumber,
    });

  const caseEntity = new Case(caseRecord, { applicationContext });

  const docketEntryEntity = caseEntity.getDocketEntryById({
    docketEntryId,
  });

  let pdfData = await getPdfBody(applicationContext, {
    docketEntryId,
  });

  console.log({ size: pdfData.length });

  const { numberOfPages, pdfData: newPdfData } = await removeCoverFromPdf({
    applicationContext,
    pdfData,
  });

  docketEntryEntity.setNumberOfPages(numberOfPages);

  const updatedDocketEntryEntity = docketEntryEntity.validate();

  await applicationContext.getPersistenceGateway().updateDocketEntry({
    applicationContext,
    docketEntryId,
    docketNumber: caseEntity.docketNumber,
    document: updatedDocketEntryEntity.toRawObject(),
  });

  await applicationContext.getPersistenceGateway().saveDocumentFromLambda({
    applicationContext,
    document: newPdfData,
    key: docketEntryId,
  });

  console.log('done');
  // console.log({ numberOfPages, size: newPdfData.length });

  // fs.writeFileSync(__dirname + '/exmple.pdf', newPdfData);
})();
