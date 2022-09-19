const { omit } = require('lodash');
const { Case } = require('../../entities/cases/Case');

/**
 * Formats consolidated cases coversheet data
 *
 * @param {object} providers.applicationContext the applicationContext
 * @param {object} providers.caseEntity the case entity
 * @param {object} providers.coverSheetData the coversheet data
 * @param {object} providers.docketEntryEntity the docketEntryEntity
 * @returns {object} coversheet data with consolidated cases
 */
exports.formatConsolidatedCaseCoversheetData = async ({
  applicationContext,
  caseEntity,
  coverSheetData,
  docketEntryEntity,
}) => {
  //add this to app context
  coverSheetData = omit(coverSheetData, [
    'dateReceived',
    'electronicallyFiled',
    'dateServed',
  ]);

  const isLeadCase = caseEntity.leadDocketNumber === caseEntity.docketNumber;
  const isFeatureFlagEnabled = await applicationContext
    .getUseCases()
    .getFeatureFlagValueInteractor(applicationContext, {
      featureFlag:
        ALLOWLIST_FEATURE_FLAGS.CONSOLIDATED_CASES_PROPAGATE_DOCKET_ENTRIES.key,
    });

  if (isLeadCase && isFeatureFlagEnabled) {
    const consolidatedCases = await applicationContext
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
    coverSheetData.consolidatedCases = consolidatedCases
      .map(consolidatedCase => ({
        docketNumber: consolidatedCase.docketNumber,
        documentNumber: (
          consolidatedCase.docketEntries.find(
            docketEntry =>
              docketEntryEntity.docketEntryId === docketEntry.docketEntryId,
          ) || {}
        ).index,
      }))
      .filter(
        consolidatedCase => consolidatedCase.documentNumber !== undefined,
      );
  }

  return coverSheetData;
};
