import { Case } from '../../entities/cases/Case';
import { formatCaseTitle } from '../../useCases/generateCoverSheetData';

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
  let consolidatedCases = await applicationContext
    .getPersistenceGateway()
    .getCasesByLeadDocketNumber({
      applicationContext,
      leadDocketNumber: caseEntity.leadDocketNumber,
    });

  consolidatedCases.sort(
    (a, b) =>
      Case.getSortableDocketNumber(a.docketNumber) -
      Case.getSortableDocketNumber(b.docketNumber),
  );

  let caseTitle;
  let caseCaptionExtension;
  consolidatedCases = consolidatedCases
    .map(consolidatedCase => {
      if (consolidatedCase.docketNumber === caseEntity.leadDocketNumber) {
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

  if (consolidatedCases.length > 1) {
    coverSheetData.consolidatedCases = consolidatedCases;
    coverSheetData.caseTitle = caseTitle;
    coverSheetData.caseCaptionExtension = caseCaptionExtension;
  }

  return coverSheetData;
};
