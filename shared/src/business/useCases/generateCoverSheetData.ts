import {
  ALLOWLIST_FEATURE_FLAGS,
  COURT_ISSUED_EVENT_CODES_REQUIRING_COVERSHEET,
  MULTI_DOCKET_EXTERNAL_FILING_EVENT_CODES,
} from '../entities/EntityConstants';
import { FORMATS, formatDateString } from '../utilities/DateHandler';
import { omit } from 'lodash';

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
export const generateCoverSheetData = async ({
  applicationContext,
  caseEntity,
  docketEntryEntity,
  filingDateUpdated = false,
  stampData,
  useInitialData = false,
}: {
  applicationContext: IApplicationContext;
  caseEntity: TCase;
  docketEntryEntity: DocketEntry;
  filingDateUpdated: boolean;
  stampData?: any;
  useInitialData: boolean;
}) => {
  const dateServedFormatted = docketEntryEntity.servedAt
    ? formatDateString(docketEntryEntity.servedAt, FORMATS.MMDDYY)
    : '';

  const dateReceivedFormatted = formatDateReceived({
    docketEntryEntity,
    isPaper: docketEntryEntity.isPaper,
  });

  const dateFiledFormatted = docketEntryEntity.filingDate
    ? formatDateString(docketEntryEntity.filingDate, FORMATS.MMDDYY)
    : '';

  if (stampData && stampData.date) {
    stampData.date = formatDateString(stampData.date, FORMATS.MMDDYYYY);
  }

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

  let coverSheetData: any = {
    caseCaptionExtension,
    caseTitle,
    certificateOfService: docketEntryEntity.certificateOfService,
    dateFiledLodged: dateFiledFormatted,
    dateFiledLodgedLabel: docketEntryEntity.lodged ? 'Lodged' : 'Filed',
    dateReceived: filingDateUpdated
      ? dateFiledFormatted
      : dateReceivedFormatted,
    dateServed: dateServedFormatted,
    docketNumberWithSuffix,
    documentTitle,
    electronicallyFiled: !docketEntryEntity.isPaper,
    index: docketEntryEntity.index,
    mailingDate: docketEntryEntity.mailingDate || '',
    stamp: stampData,
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
  }

  if (
    COURT_ISSUED_EVENT_CODES_REQUIRING_COVERSHEET.includes(
      docketEntryEntity.eventCode,
    ) ||
    MULTI_DOCKET_EXTERNAL_FILING_EVENT_CODES.includes(
      docketEntryEntity.eventCode,
    )
  ) {
    const isLeadCase = caseEntity.leadDocketNumber === caseEntity.docketNumber;
    // const isFeatureFlagEnabled = await applicationContext
    //   .getUseCases()
    //   .getFeatureFlagValueInteractor(applicationContext, {
    //     featureFlag:
    //       ALLOWLIST_FEATURE_FLAGS.CONSOLIDATED_CASES_PROPAGATE_DOCKET_ENTRIES
    //         .key,
    //   });

    if (isLeadCase) {
      coverSheetData = await applicationContext
        .getUseCaseHelpers()
        .formatConsolidatedCaseCoversheetData({
          applicationContext,
          caseEntity,
          coverSheetData,
          docketEntryEntity,
        });
    }
  }

  return coverSheetData;
};
