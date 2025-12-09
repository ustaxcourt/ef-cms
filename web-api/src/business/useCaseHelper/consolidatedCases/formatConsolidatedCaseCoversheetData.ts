import { Case } from '@shared/business/entities/cases/Case';
import { formatCaseTitle } from '@web-api/business/useCases/generateCoverSheetData';
import { getCaseByDocketNumber } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { getConsolidatedCases } from '@web-api/persistence/postgres/cases/getConsolidatedCases';

/**
 * Formats consolidated cases coversheet data
 * @param {object} providers.applicationContext the applicationContext
 * @param {object} providers.caseEntity the case entity
 * @param {object} providers.coverSheetData the coversheet data
 * @param {object} providers.docketEntryEntity the docketEntryEntity
 * @returns {object} coversheet data with consolidated cases
 */
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
        consolidatedCase.docketNumber ===
        docketEntryEntity.multiDocketedOriginalDocketNumber
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

  if (!caseTitle) {
    const originalFilingCase = await getCaseByDocketNumber({
      docketNumber: docketEntryEntity.multiDocketedOriginalDocketNumber,
      includeConsolidatedCases: false,
    });
    ({ caseCaptionExtension, caseTitle } = formatCaseTitle({
      applicationContext,
      caseEntity: originalFilingCase,
      useInitialData,
    }));
  }

  if (consolidatedCasesFiltered.length > 1) {
    coverSheetData.consolidatedCases = consolidatedCasesFiltered;
    coverSheetData.caseTitle = caseTitle;
    coverSheetData.caseCaptionExtension = caseCaptionExtension;
  }

  return coverSheetData;
};
