const {
  ALLOWLIST_FEATURE_FLAGS,
  COURT_ISSUED_EVENT_CODES_REQUIRING_COVERSHEET,
} = require('../entities/EntityConstants');
const { Case } = require('../entities/cases/Case');
const { formatDateString, FORMATS } = require('../utilities/DateHandler');
const { omit } = require('lodash');

const formatDateReceived = ({ docketEntryEntity, isPaper }) => {
  const formatString = isPaper ? FORMATS.MMDDYY : FORMATS.DATE_TIME;
  return docketEntryEntity.createdAt
    ? formatDateString(docketEntryEntity.createdAt, formatString)
    : '';
};

/**
 * a helper function which assembles the correct data to be used in the generation of a PDF
 *
 * @param {object} options the providers object
 * @param {object} options.applicationContext the application context
 * @param {string} options.caseEntity the case entity associated with the document we are creating the cover for
 * @param {object} options.docketEntryEntity the docket entry entity we are creating the cover for
 * @param {boolean} options.useInitialData whether to use the initial docket record suffix and case caption
 * @returns {object} the key/value pairs of computed strings
 */
exports.generateCoverSheetData = async ({
  applicationContext,
  caseEntity,
  docketEntryEntity,
  filingDateUpdated = false,
  useInitialData = false,
}) => {
  const isLodged = docketEntryEntity.lodged;
  const { certificateOfService, isPaper } = docketEntryEntity;

  const dateServedFormatted = docketEntryEntity.servedAt
    ? formatDateString(docketEntryEntity.servedAt, FORMATS.MMDDYY)
    : '';

  let dateReceivedFormatted = formatDateReceived({
    applicationContext,
    docketEntryEntity,
    isPaper,
  });

  const dateFiledFormatted = docketEntryEntity.filingDate
    ? formatDateString(docketEntryEntity.filingDate, FORMATS.MMDDYY)
    : '';

  const caseCaption = useInitialData
    ? caseEntity.initialCaption
    : caseEntity.caseCaption;

  const docketNumberSuffixToUse = useInitialData
    ? caseEntity.initialDocketNumberSuffix.replace('_', '')
    : caseEntity.docketNumberSuffix;

  let caseTitle = applicationContext.getCaseTitle(caseCaption);
  let caseCaptionExtension = '';
  if (caseTitle !== caseCaption) {
    caseTitle += ', ';
    caseCaptionExtension = caseCaption.replace(caseTitle, '');
  }

  let documentTitle =
    docketEntryEntity.documentTitle || docketEntryEntity.documentType;
  if (docketEntryEntity.additionalInfo && docketEntryEntity.addToCoversheet) {
    documentTitle += ` ${docketEntryEntity.additionalInfo}`;
  }

  const docketNumberWithSuffix =
    caseEntity.docketNumber + (docketNumberSuffixToUse || '');

  let coverSheetData = {
    caseCaptionExtension,
    caseTitle,
    certificateOfService,
    dateFiledLodged: dateFiledFormatted,
    dateFiledLodgedLabel: isLodged ? 'Lodged' : 'Filed',
    dateReceived: filingDateUpdated
      ? dateFiledFormatted
      : dateReceivedFormatted,
    dateServed: dateServedFormatted,
    docketNumberWithSuffix,
    documentTitle,
    electronicallyFiled: !docketEntryEntity.isPaper,
    index: docketEntryEntity.index,
    mailingDate: docketEntryEntity.mailingDate || '',
  };

  if (
    COURT_ISSUED_EVENT_CODES_REQUIRING_COVERSHEET.includes(
      docketEntryEntity.eventCode,
    )
  ) {
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
          ALLOWLIST_FEATURE_FLAGS.CONSOLIDATED_CASES_PROPAGATE_DOCKET_ENTRIES
            .key,
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
  }

  return coverSheetData;
};
