import { Case } from '../../../../../shared/src/business/entities/cases/Case';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
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
const createStampedCoversheetPdf = async ({
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

export const generateStampedCoversheetInteractor = async (
  applicationContext,
  { docketEntryId, docketNumber, stampData, stampedDocketEntryId },
  authorizedUser: UnknownAuthUser,
) => {
  const caseRecord = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({
      applicationContext,
      docketNumber,
    });

  const caseEntity = new Case(caseRecord, {
    authorizedUser,
  });

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
