// qpdf-based replacement for the pdf-lib hot path inside
// serveExternallyFiledDocumentInteractor. Used only by that interactor — the
// other coversheet + paper-service callers continue through addCoverToPdf and
// appendPaperServiceAddressPageToPdf on pdf-lib, since their inputs are
// small enough that pdf-lib's deep-clone cost is invisible.
//
// Two exports:
//   - prependCoversheetWithQpdfAndPersist  → mirrors addCoversheetInteractor
//   - runPaperServiceWithQpdf              → mirrors serveDocumentAndGetPaperServicePdf
//
// The interactor owns the scratch directory lifecycle (mkdtemp + finally rm)
// so both helpers can read the cover-attached PDF off disk without re-fetching
// it from S3, and so a partial failure can't leak files on the warm-reused
// /tmp.

import path from 'node:path';
import { readFile, writeFile } from 'node:fs/promises';
import { Case } from '@shared/business/entities/cases/Case';
import { DocketEntry } from '@shared/business/entities/DocketEntry';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { aggregatePartiesForService } from '@shared/business/utilities/aggregatePartiesForService';
import { generateCoverSheetData } from '@web-api/business/useCases/generateCoverSheetData';
import { getCasesByDocketNumbers } from '@web-api/persistence/postgres/cases/getCasesByDocketNumbers';
import { qpdfMerge, qpdfPageCount } from '@web-api/utilities/qpdf';
import { upsertDocketEntries } from '@web-api/persistence/postgres/docketEntries/upsertDocketEntries';

type PrependInputs = {
  applicationContext: ServerApplicationContext;
  authorizedUser: UnknownAuthUser;
  caseEntity: Case;
  docketEntryEntity: DocketEntry;
  documentStorageId: string;
  originalPdfPath: string;
  workDir: string;
};

// Generates a fresh coversheet, prepends it to the original PDF via qpdf,
// uploads the result back to S3 at documentStorageId, and replicates the
// docket-entry COMPLETE/numberOfPages upserts that addCoversheetInteractor
// performs on the equivalent pdf-lib path.
export const prependCoversheetWithQpdfAndPersist = async ({
  applicationContext,
  authorizedUser,
  caseEntity,
  docketEntryEntity,
  documentStorageId,
  originalPdfPath,
  workDir,
}: PrependInputs): Promise<{ withCoverPath: string; numberOfPages: number }> => {
  // Reuse the existing data-shaping helper so the coversheet content is
  // pixel-identical to the pdf-lib path. consolidatedCases is added to this
  // payload by formatConsolidatedCaseCoversheetData when the case is part of
  // a multi-docket filing — we need it below to fan the upsert across the
  // consolidated group, exactly like addCoversheetInteractor does.
  const coverSheetData: {
    consolidatedCases?: { docketNumber: string; documentNumber?: number }[];
  } & Record<string, any> = await generateCoverSheetData({
    applicationContext,
    caseEntity,
    docketEntryEntity,
    filingDateUpdated: false,
  });

  const coverBytes = await applicationContext
    .getDocumentGenerators()
    .coverSheet({ applicationContext, data: coverSheetData });
  const coverPath = path.join(workDir, 'cover.pdf');
  await writeFile(coverPath, coverBytes);

  // qpdf builds the merged document by rewriting the page tree at the xref
  // level, so cost scales with page count metadata rather than page content.
  const withCoverPath = path.join(workDir, 'with-cover.pdf');
  await qpdfMerge({
    inputs: [coverPath, originalPdfPath],
    output: withCoverPath,
  });

  const withCoverBytes = await readFile(withCoverPath);
  await applicationContext.getPersistenceGateway().saveDocumentFromLambda({
    document: withCoverBytes,
    key: documentStorageId,
  });

  // Read the count back from the actual file rather than assuming pre+1.
  // Defensive against future coversheet templates that emit more than one
  // page and against any qpdf normalization that changes page count.
  const numberOfPages = await qpdfPageCount(withCoverPath);

  // Mirror addCoversheetInteractor.ts:103-148: when the cover-sheet flow
  // produced a consolidated list, update each consolidated case's copy of
  // the docket entry; otherwise just the subject case.
  const docketNumbersToUpdate = coverSheetData.consolidatedCases
    ? coverSheetData.consolidatedCases
        .filter(c => c.documentNumber)
        .map(c => c.docketNumber)
    : [caseEntity.docketNumber];

  const casesToUpdate = await getCasesByDocketNumbers({
    docketNumbers: docketNumbersToUpdate,
  });

  const updatedDocketEntries = casesToUpdate
    .map(caseRecord => {
      const updateCaseEntity: Case =
        caseRecord.docketNumber === caseEntity.docketNumber
          ? caseEntity
          : new Case(caseRecord, { authorizedUser });
      const existing = updateCaseEntity.getDocketEntryById({
        docketEntryId: docketEntryEntity.docketEntryId,
      });
      if (!existing) return undefined;
      const updated = new DocketEntry(existing, { authorizedUser });
      updated.setAsProcessingStatusAsCompleted();
      updated.setNumberOfPages(numberOfPages);
      return updated.validate().toRawObject();
    })
    .filter((e): e is NonNullable<typeof e> => e !== undefined);

  await upsertDocketEntries(updatedDocketEntries);

  return { withCoverPath, numberOfPages };
};

type PaperServiceInputs = {
  applicationContext: ServerApplicationContext;
  caseEntities: Case[];
  docketEntryId: string;
  withCoverPath: string;
  workDir: string;
};

// For each served case: send the electronic emails (always, even when no
// paper parties exist), and accumulate qpdf merge args of the form
// [address-label, full-notice] per paper party. When at least one paper
// party exists across all cases, builds the print-ready bundle via a single
// qpdf invocation and uploads it to the temp bucket; returns the signed URL
// for the websocket payload. When no paper parties exist anywhere, returns
// pdfUrl: undefined (matches today's serveDocumentAndGetPaperServicePdf
// shape, which the UI already handles in serveDocumentCompleteSequence).
export const runPaperServiceWithQpdf = async ({
  applicationContext,
  caseEntities,
  docketEntryId,
  withCoverPath,
  workDir,
}: PaperServiceInputs): Promise<{ pdfUrl?: string }> => {
  // Order matters here — clerks expect the printed bundle to be in
  // outer=caseEntities, inner=servedParties.paper order, mirroring the
  // legacy loop in appendPaperServiceAddressPageToPdf.ts.
  const mergeArgs: string[] = [];
  let addressIndex = 0;

  for (const caseEntity of caseEntities) {
    const servedParties = aggregatePartiesForService(caseEntity);

    await applicationContext.getUseCaseHelpers().sendServedPartiesEmails({
      applicationContext,
      caseEntity,
      docketEntryId,
      servedParties,
    });

    for (const paperParty of servedParties.paper) {
      const addressBytes = await applicationContext
        .getDocumentGenerators()
        .addressLabelCoverSheet({
          applicationContext,
          data: {
            ...paperParty,
            docketNumberWithSuffix: caseEntity.docketNumberWithSuffix,
          },
        });
      const addrPath = path.join(workDir, `addr-${addressIndex}.pdf`);
      await writeFile(addrPath, addressBytes);
      addressIndex += 1;
      mergeArgs.push(addrPath, withCoverPath);
    }
  }

  if (mergeArgs.length === 0) {
    return {};
  }

  const paperServicePath = path.join(workDir, 'paper-service.pdf');
  await qpdfMerge({ inputs: mergeArgs, output: paperServicePath });

  const bundleBytes = await readFile(paperServicePath);
  const { url } = await applicationContext
    .getUseCaseHelpers()
    .saveFileAndGenerateUrl({
      applicationContext,
      file: bundleBytes,
      useTempBucket: true,
    });
  return { pdfUrl: url };
};
