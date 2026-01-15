import { Case, isLeadCase } from '@shared/business/entities/cases/Case';
import { formatCaseTitle } from '@web-api/business/useCases/generateCoverSheetData';
import { getConsolidatedCases } from '@web-api/persistence/postgres/cases/getConsolidatedCases';

export const formatConsolidatedCaseCoversheetData = async ({
  applicationContext,
  caseEntity,
  coverSheetData,
  docketEntryEntity,
  useInitialData,
}) => {
  let consolidatedCases = await getConsolidatedCases({
    leadDocketNumber: caseEntity.leadDocketNumber,
  });

  consolidatedCases = Case.sortByDocketNumber(consolidatedCases);

  let caseTitle;
  let caseCaptionExtension;
  const consolidatedCasesFiltered = consolidatedCases
    ?.map(consolidatedCase => {
      if (
        isLeadCase({
          docketNumber: consolidatedCase.docketNumber,
          leadDocketNumber: caseEntity.leadDocketNumber,
        })
      ) {
        ({ caseCaptionExtension, caseTitle } = formatCaseTitle({
          applicationContext,
          caseEntity: consolidatedCase,
          useInitialData,
        }));
      }
      return {
        docketNumber: consolidatedCase.docketNumber,
        documentNumber: (
          consolidatedCase.docketEntries.find(
            docketEntry =>
              docketEntryEntity.docketEntryId === docketEntry.docketEntryId,
          ) || {}
        ).index,
      };
    })
    .filter(consolidatedCase => consolidatedCase.documentNumber !== undefined);

  if (consolidatedCasesFiltered.length > 1) {
    coverSheetData.consolidatedCases = consolidatedCasesFiltered;
    coverSheetData.caseTitle = caseTitle;
    coverSheetData.caseCaptionExtension = caseCaptionExtension;
  }

  return coverSheetData;
};
