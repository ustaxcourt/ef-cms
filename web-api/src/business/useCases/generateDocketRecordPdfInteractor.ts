import {
  Case,
  getPractitionersRepresenting,
} from '@shared/business/entities/cases/Case';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { type ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';
import { type UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { getCaseByDocketNumber } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { getCaseCaptionMeta } from '@shared/business/utilities/getCaseCaptionMeta';
import { sortDocketEntryTable } from '@web-client/presenter/computeds/formattedDocketEntries';
import { verifyCaseForUser } from '@web-api/persistence/postgres/cases/userOnCase/verifyCaseForUser';
import {
  DocketEntryRelation,
  MOTION_DISPOSITION_VERBIAGE,
} from '@shared/business/entities/EntityConstants';
import { concat } from 'lodash';
import {
  type FormattedCaseDetail,
  type FormattedCaseDetailDocketEntry,
} from '@shared/business/utilities/getFormattedCaseDetail';
import { addPageNumbersToPdf } from '@shared/business/utilities/pdfs/addPageNumbersToPdf';
import { PDFDocument } from 'pdf-lib';

type DocketRecordPdfCaseDetail = Omit<
  FormattedCaseDetail,
  'formattedDocketEntries' | 'petitioners'
> & {
  formattedDocketEntries: (FormattedCaseDetailDocketEntry & {
    relatedDocketEntries: {
      docketEntryIndex: number | undefined;
      dispositionText: string[];
    }[];
  })[];
  petitioners: (TPetitioner & {
    index: number;
    counselDetails: {
      name: string;
      email?: string;
      phone?: string;
    }[];
  })[];
};

export const generateDocketRecordPdfInteractor = async (
  applicationContext: ServerApplicationContext,
  {
    docketNumber,
    docketRecordSort,
    docketRecordTableSort,
    includePartyDetail = false,
    isIndirectlyAssociated = false,
  }: {
    docketNumber: string;
    docketRecordSort?: string;
    docketRecordTableSort?: { sortField: string; sortOrder: 'asc' | 'desc' };
    includePartyDetail: boolean;
    isIndirectlyAssociated?: boolean;
  },
  authorizedUser: UnknownAuthUser,
) => {
  const isDirectlyAssociated = await verifyCaseForUser({
    docketNumber,
    userId: authorizedUser?.userId || '',
  });

  const caseSource = await getCaseByDocketNumber({
    docketNumber,
  });

  let caseEntity;

  const isSealedCase = applicationContext
    .getUtilities()
    .isSealedCase(caseSource);

  if (isSealedCase) {
    if (authorizedUser?.userId) {
      const isAuthorizedToViewSealedCase = isAuthorized(
        authorizedUser,
        ROLE_PERMISSIONS.VIEW_SEALED_CASE,
      );

      if (
        isAuthorizedToViewSealedCase ||
        isDirectlyAssociated ||
        isIndirectlyAssociated
      ) {
        caseEntity = new Case(caseSource, { authorizedUser });
      } else {
        // unassociated user viewing sealed case
        throw new UnauthorizedError('Unauthorized to view sealed case.');
      }
    } else {
      //public user
      throw new UnauthorizedError('Unauthorized to view sealed case.');
    }
  } else {
    caseEntity = new Case(caseSource, { authorizedUser });
  }
  const formattedCaseDetail = applicationContext
    .getUtilities()
    .getFormattedCaseDetail({
      applicationContext,
      authorizedUser,
      caseDetail: caseEntity,
      docketRecordSort,
    });

  const formattedDocketEntries = formattedCaseDetail.formattedDocketEntries.map(
    docketEntry => {
      const formattedDocketEntry = {
        ...docketEntry,
        numberOfPages: docketEntry.numberOfPages || 0,
      };

      let relatedDocketEntries: {
        docketEntryIndex: number | undefined;
        dispositionText: string[];
      }[] = [];
      if (docketEntry.affectedByDocketEntries) {
        relatedDocketEntries = processRelatedDocketEntries(
          docketEntry.affectedByDocketEntries,
          caseEntity,
          'MOTION',
        );
      }

      if (docketEntry.affectedDocketEntries) {
        relatedDocketEntries = concat(
          relatedDocketEntries,
          processRelatedDocketEntries(
            docketEntry.affectedDocketEntries,
            caseEntity,
            'ORDER',
          ),
        );
      }

      return { ...formattedDocketEntry, relatedDocketEntries };
    },
  );

  const sortedDocketEntries = sortDocketEntryTable(
    formattedDocketEntries,
    docketRecordTableSort && docketRecordTableSort.sortField,
    docketRecordTableSort && docketRecordTableSort.sortOrder,
  );

  const formattedPetitioners = formattedCaseDetail.petitioners.map(
    (petitioner, index) => {
      const counselDetails: {
        name: string;
        email?: string;
        phone?: string;
      }[] = [];
      const practitioners =
        getPractitionersRepresenting(
          formattedCaseDetail as RawCase,
          petitioner.contactId,
        ) || [];
      if (practitioners.length > 0) {
        for (const practitioner of practitioners) {
          counselDetails.push({
            email: practitioner.email,
            name: practitioner.formattedName,
            phone: practitioner.contact?.phone,
          });
        }
      } else {
        counselDetails.push({
          name: 'None',
        });
      }
      return { ...petitioner, counselDetails, index };
    },
  );

  const caseDetail: DocketRecordPdfCaseDetail = {
    ...formattedCaseDetail,
    formattedDocketEntries: sortedDocketEntries,
    petitioners: formattedPetitioners,
  };

  const { caseCaptionExtension, caseTitle } = getCaseCaptionMeta(caseEntity);

  const docketNumberWithSuffix = Case.getDocketNumberWithSuffix({
    docketNumber: caseEntity.docketNumber,
    docketNumberSuffix: caseEntity.docketNumberSuffix,
  });

  const entriesToPrint = sortedDocketEntries.filter(d => d.isOnDocketRecord);

  const pdf = await generateDocketRecordPdf({
    applicationContext,
    caseCaptionExtension,
    caseDetail,
    caseTitle,
    docketNumberWithSuffix,
    entries: entriesToPrint,
    includePartyDetail,
  });

  return await applicationContext.getUseCaseHelpers().saveFileAndGenerateUrl({
    applicationContext,
    file: pdf,
    useTempBucket: true,
  });
};

// Maximum entries per chunk. Each chunk is rendered to HTML and converted to
// PDF in a separate Puppeteer/Lambda invocation to stay within memory limits.
const DOCKET_RECORD_CHUNK_SIZE = 500;

// Entry count below which we use the original single-pass approach (no
// chunking overhead for small cases).
const CHUNKING_THRESHOLD = 1000;

async function generateDocketRecordPdf({
  applicationContext,
  caseCaptionExtension,
  caseDetail,
  caseTitle,
  docketNumberWithSuffix,
  entries,
  includePartyDetail,
}: {
  applicationContext: ServerApplicationContext;
  caseCaptionExtension: string;
  caseDetail: DocketRecordPdfCaseDetail;
  caseTitle: string;
  docketNumberWithSuffix: string;
  entries: any[];
  includePartyDetail: boolean;
}): Promise<Uint8Array> {
  // For small cases, use the original single-pass generation to avoid
  // unnecessary overhead from chunking + merging + overlay.
  if (entries.length < CHUNKING_THRESHOLD) {
    return await applicationContext
      .getDocumentGenerators()
      .docketRecord({
        applicationContext,
        data: {
          caseCaptionExtension,
          caseDetail,
          caseTitle,
          docketNumberWithSuffix,
          entries,
          includePartyDetail,
        },
      });
  }

  // Large case: split entries into chunks and generate a PDF for each chunk,
  // then merge them and overlay accurate page numbers.
  const chunks: any[][] = [];
  for (let i = 0; i < entries.length; i += DOCKET_RECORD_CHUNK_SIZE) {
    chunks.push(entries.slice(i, i + DOCKET_RECORD_CHUNK_SIZE));
  }

  const commonData = {
    caseCaptionExtension,
    caseDetail,
    caseTitle,
    docketNumberWithSuffix,
    includePartyDetail,
  };

  // Generate each chunk PDF sequentially to keep memory usage low.
  // Each call goes through generatePdfFromHtmlInteractor which, in deployed
  // environments, invokes the pdf_generator Lambda (separate memory space).
  const chunkPdfs: Uint8Array[] = [];
  for (let i = 0; i < chunks.length; i++) {
    const isFirstChunk = i === 0;

    const chunkPdf = await applicationContext
      .getDocumentGenerators()
      .docketRecord({
        applicationContext,
        data: {
          ...commonData,
          displayHeaderFooter: false,
          entries: chunks[i],
          includePartyInfo: isFirstChunk,
        },
      });

    chunkPdfs.push(chunkPdf);
  }

  // Merge all chunk PDFs into a single document.
  const mergedPdf = await PDFDocument.create();
  for (const chunkPdfData of chunkPdfs) {
    const chunkDoc = await PDFDocument.load(chunkPdfData);
    const copiedPages = await mergedPdf.copyPages(
      chunkDoc,
      chunkDoc.getPageIndices(),
    );
    for (const page of copiedPages) {
      mergedPdf.addPage(page);
    }
  }

  const mergedPdfBytes = await mergedPdf.save();

  // Add accurate page numbers and footer across the full merged document.
  const datePrinted = applicationContext.getUtilities().formatNow('MMDDYY');
  const finalPdf = await addPageNumbersToPdf({
    datePrinted,
    docketNumber: docketNumberWithSuffix,
    pdfData: mergedPdfBytes,
  });

  return finalPdf;
}

const processRelatedDocketEntries = (
  relatedDocketEntries: DocketEntryRelation[],
  caseEntity: RawCase,
  relationshipType: 'ORDER' | 'MOTION',
) => {
  return relatedDocketEntries.map(affectedEntry => {
    const relatedEntry = caseEntity.docketEntries.find(
      entry => entry.docketEntryId === affectedEntry.docketEntryId,
    );

    const dispositionText = MOTION_DISPOSITION_VERBIAGE[
      affectedEntry.disposition
    ][relationshipType].map(d => `${d} #${relatedEntry?.index}`);

    return {
      docketEntryIndex: relatedEntry?.index,
      dispositionText,
    };
  });
};
