import { Case, isMemberCase } from '@shared/business/entities/cases/Case';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { addCoverToPdf } from './addCoverToPdf';
import { getCaseByDocketNumber } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { NotFoundError } from '@web-api/errors/errors';
import { updateDocketEntriesWithPageCount } from '@web-api/business/useCaseHelper/coverSheet/updateDocketEntriesWithPageCount';

export const addCoversheetInteractor = async (
  applicationContext: ServerApplicationContext,
  {
    caseEntity,
    docketEntryId,
    docketNumber,
    filingDateUpdated = false,
    replaceCoversheet = false,
    useInitialData = false,
  }: {
    caseEntity?: Case;
    docketEntryId: string;
    docketNumber: string;
    filingDateUpdated?: boolean;
    replaceCoversheet?: boolean;
    useInitialData?: boolean;
  },
  authorizedUser: UnknownAuthUser,
) => {
  if (!caseEntity) {
    const caseRecord = await getCaseByDocketNumber({
      docketNumber,
    });

    caseEntity = new Case(caseRecord, {
      authorizedUser,
    });
  }
  const docketEntryEntity = caseEntity.getDocketEntryById({
    docketEntryId,
  });

  if (!docketEntryEntity) {
    throw new NotFoundError(
      `Could not find docket entry with id ${docketEntryId} on case ${docketNumber}`,
    );
  }

  const pdfData = await applicationContext.getPersistenceGateway().getDocument({
    applicationContext,
    key: docketEntryEntity.documentStorageId,
  });

  const {
    consolidatedCases, // if feature flag is off, this will always be null
    numberOfPages,
    pdfData: newPdfData,
  } = await addCoverToPdf({
    applicationContext,
    caseEntity,
    docketEntryEntity,
    filingDateUpdated,
    pdfData,
    replaceCoversheet,
    useInitialData,
  });

  let pageCount: number;

  if (isMemberCase(caseEntity)) {
    if (replaceCoversheet) {
      throw new Error(
        'Coversheet replacement for multidocketed filings must be performed on the lead case',
      );
    }

    const { PDFDocument } = await applicationContext.getPdfLib();
    const existingPdfDoc = await PDFDocument.load(pdfData);
    pageCount = existingPdfDoc.getPageCount();
  } else {
    await applicationContext.getPersistenceGateway().saveDocumentFromLambda({
      document: newPdfData,
      key: docketEntryEntity.documentStorageId,
    });
    pageCount = numberOfPages;
  }

  const updatedDocketEntries = await updateDocketEntriesWithPageCount({
    authorizedUser,
    caseEntity,
    consolidatedCases,
    docketEntryId,
    docketNumber,
    pageCount,
  });

  return updatedDocketEntries.find(
    entry => entry.docketNumber === docketNumber,
  );
};
