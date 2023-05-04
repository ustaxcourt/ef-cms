import { Case } from '../../entities/cases/Case';

/**
 * Formats consolidated cases coversheet data
 *
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
}) => {
  let consolidatedCases = await applicationContext
    .getPersistenceGateway()
    .getCasesByLeadDocketNumber({
      applicationContext,
      leadDocketNumber: caseEntity.docketNumber,
    });

  consolidatedCases.sort(
    (a, b) =>
      Case.getSortableDocketNumber(a.docketNumber) -
      Case.getSortableDocketNumber(b.docketNumber),
  );

  consolidatedCases = consolidatedCases
    .map(consolidatedCase => ({
      docketNumber: consolidatedCase.docketNumber,
      documentNumber: (
        consolidatedCase.docketEntries.find(
          docketEntry =>
            docketEntryEntity.docketEntryId === docketEntry.docketEntryId,
        ) || {}
      ).index,
    }))
    .filter(consolidatedCase => consolidatedCase.documentNumber !== undefined);

  if (consolidatedCases.length) {
    coverSheetData.consolidatedCases = consolidatedCases;
  }

  return coverSheetData;
};
