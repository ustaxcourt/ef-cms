import { Case } from '../../entities/cases/Case';
import { generateCoverSheetData } from '../../useCases/generateCoverSheetData';

/**
 * a helper function which creates a coversheet with stampData on it, then returns the new coversheet pdf
 *
 * @param {object} options the providers object
 * @param {object} options.applicationContext the application context
 * @param {string} options.caseEntity the case entity associated with the document we are creating the cover for
 * @param {object} options.docketEntryEntity the docket entry entity we are creating the cover for
 * @param {object} options.stampData the stampData from the form to add to the coversheet pdf
 * @returns {object} the new coversheet pdf
 */
export const createStampedCoversheetPdf = async ({
  applicationContext,
  caseEntity,
  docketEntryEntity,
  stampData,
}) => {
  docketEntryEntity.servedAt = undefined;

  const coverSheetData = await generateCoverSheetData({
    applicationContext,
    caseEntity,
    docketEntryEntity,
    stampData,
  });

  const { PDFDocument } = await applicationContext.getPdfLib();

  const coverPagePdf = await applicationContext
    .getDocumentGenerators()
    .coverSheet({
      applicationContext,
      data: coverSheetData,
    });

  const coverPageDocument = await PDFDocument.load(coverPagePdf);

  const newPdfData = await coverPageDocument.save();

  return {
    pdfData: newPdfData,
  };
};

/**
 * generateStampedCoversheetInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketEntryId the docket entry id of the original motion
 * @param {string} providers.docketNumber the docket number of the case
 * @param {boolean} providers.stampData the stamp data from the form to be applied to the stamp order pdf
 * @param {string} providers.stampedDocketEntryId the docket entry id of the new stamped order docket entry
 * @returns {Promise<*>} updated docket entry entity
 */
export const generateStampedCoversheetInteractor = async (
  applicationContext,
  { docketEntryId, docketNumber, stampData, stampedDocketEntryId },
) => {
  const caseRecord = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({
      applicationContext,
      docketNumber,
    });

  const caseEntity = new Case(caseRecord, { applicationContext });

  const motionDocketEntryEntity = caseEntity.getDocketEntryById({
    docketEntryId,
  });

  const { pdfData: newPdfData } = await createStampedCoversheetPdf({
    applicationContext,
    caseEntity,
    docketEntryEntity: motionDocketEntryEntity,
    stampData,
  });

  await applicationContext.getPersistenceGateway().saveDocumentFromLambda({
    applicationContext,
    document: newPdfData,
    key: stampedDocketEntryId,
  });
};
