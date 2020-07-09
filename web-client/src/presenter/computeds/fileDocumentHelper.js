import { getSupportingDocumentTypeList } from './addDocketEntryHelper';
import { state } from 'cerebral';

export const supportingDocumentFreeTextTypes = [
  'Affidavit in Support',
  'Declaration in Support',
  'Unsworn Declaration under Penalty of Perjury in Support',
];

export const fileDocumentHelper = (get, applicationContext) => {
  const { formatCase } = applicationContext.getUtilities();
  const { CATEGORY_MAP, PARTY_TYPES } = applicationContext.getConstants();
  const caseDetail = get(state.caseDetail);
  if (!caseDetail.partyType) {
    return {};
  }
  const form = get(state.form);
  const validationErrors = get(state.validationErrors);
  const showSecondaryParty =
    caseDetail.partyType === PARTY_TYPES.petitionerSpouse ||
    caseDetail.partyType === PARTY_TYPES.petitionerDeceasedSpouse;

  const supportingDocumentTypeList = getSupportingDocumentTypeList(
    CATEGORY_MAP,
  );

  const objectionDocumentTypes = [
    ...CATEGORY_MAP['Motion'].map(entry => {
      return entry.documentType;
    }),
    'Motion to Withdraw Counsel (filed by petitioner)',
    'Motion to Withdraw as Counsel',
    'Application to Take Deposition',
  ];

  const amendmentEventCodes = ['AMAT', 'ADMT'];

  const partyValidationError =
    validationErrors.partyPrimary ||
    validationErrors.partySecondary ||
    validationErrors.partyIrsPractitioner;

  let { certificateOfServiceDate } = form;
  let certificateOfServiceDateFormatted;
  if (certificateOfServiceDate) {
    certificateOfServiceDateFormatted = applicationContext
      .getUtilities()
      .formatDateString(certificateOfServiceDate, 'MMDDYY');
  }

  const showSecondaryDocument =
    form.secondaryDocument && form.secondaryDocument.documentTitle;

  const secondaryDocumentCertificateOfServiceDate =
    form.secondaryDocument && form.secondaryDocument.certificateOfServiceDate;
  let secondaryDocumentCertificateOfServiceDateFormatted;
  if (secondaryDocumentCertificateOfServiceDate) {
    secondaryDocumentCertificateOfServiceDateFormatted = applicationContext
      .getUtilities()
      .formatDateString(secondaryDocumentCertificateOfServiceDate, 'MMDDYY');
  }

  let showFilingIncludes = form.certificateOfService || form.attachments;

  const showSecondaryFilingIncludes =
    form.secondaryDocument &&
    (form.secondaryDocument.certificateOfService ||
      form.secondaryDocument.attachments);

  const supportingDocumentCount =
    (form.supportingDocuments && form.supportingDocuments.length) || 0;
  const showAddSupportingDocuments =
    !supportingDocumentCount || supportingDocumentCount < 5;
  const showAddSupportingDocumentsLimitReached = !!(
    supportingDocumentCount && supportingDocumentCount >= 5
  );

  const showSecondaryDocumentInclusionsForm =
    form.documentType !== 'Motion for Leave to File' ||
    !!form.secondaryDocumentFile;

  const secondarySupportingDocumentCount =
    (form.secondarySupportingDocuments &&
      form.secondarySupportingDocuments.length) ||
    0;
  const showAddSecondarySupportingDocuments =
    (!secondarySupportingDocumentCount ||
      secondarySupportingDocumentCount < 5) &&
    (form.documentType !== 'Motion for Leave to File' ||
      !!form.secondaryDocumentFile);
  const showAddSecondarySupportingDocumentsLimitReached = !!(
    secondarySupportingDocumentCount && secondarySupportingDocumentCount >= 5
  );

  const selectedCasesMap = (form.selectedCases || []).reduce(
    (acc, docketNumber) => {
      acc[docketNumber] = true;
      return acc;
    },
    {},
  );

  const selectedCasesAsCase = (caseDetail.consolidatedCases || [])
    .reduce((acc, consolidatedCase) => {
      if (selectedCasesMap[consolidatedCase.docketNumber]) {
        acc.push({ ...consolidatedCase });
      }
      return acc;
    }, [])
    .map(consolidatedCase => formatCase(applicationContext, consolidatedCase))
    .map(consolidatedCase => {
      consolidatedCase.showSecondaryParty =
        consolidatedCase.partyType === PARTY_TYPES.petitionerSpouse ||
        consolidatedCase.partyType === PARTY_TYPES.petitionerDeceasedSpouse;
      return consolidatedCase;
    });

  const formattedSelectedCasesAsCase = selectedCasesAsCase.map(selectedCase =>
    formatCase(applicationContext, selectedCase),
  );

  let selectedDocketNumbers = get(state.form.selectedCases);
  let formattedDocketNumbers = null;

  if (selectedDocketNumbers) {
    // convert to Case entity-like object to use entity method
    selectedDocketNumbers = selectedDocketNumbers.map(docketNumber => ({
      docketNumber,
    }));

    const sortedDocketNumbers = selectedDocketNumbers
      .sort(applicationContext.getUtilities().compareCasesByDocketNumber)
      .map(({ docketNumber }) => docketNumber);

    formattedDocketNumbers = [
      sortedDocketNumbers.slice(0, -1).join(', '),
      sortedDocketNumbers.slice(-1)[0],
    ].join(sortedDocketNumbers.length < 2 ? '' : ' & ');
  }

  let exported = {
    certificateOfServiceDateFormatted,
    formattedDocketNumbers,
    formattedSelectedCasesAsCase,
    isSecondaryDocumentUploadOptional:
      form.documentType === 'Motion for Leave to File',
    partyValidationError,
    primaryDocument: {
      showObjection:
        objectionDocumentTypes.includes(form.documentType) ||
        (amendmentEventCodes.includes(form.eventCode) &&
          objectionDocumentTypes.includes(form.previousDocument?.documentType)),
    },
    secondaryDocument: {
      certificateOfServiceDateFormatted: secondaryDocumentCertificateOfServiceDateFormatted,
      showObjection:
        form.secondaryDocument &&
        form.secondaryDocumentFile &&
        (objectionDocumentTypes.includes(form.secondaryDocument.documentType) ||
          (amendmentEventCodes.includes(form.secondaryDocument.eventCode) &&
            objectionDocumentTypes.includes(
              form.secondaryDocument.previousDocument?.documentType,
            ))),
    },
    selectedCasesAsCase,
    showAddSecondarySupportingDocuments,
    showAddSecondarySupportingDocumentsLimitReached,
    showAddSupportingDocuments,
    showAddSupportingDocumentsLimitReached,
    showFilingIncludes,
    showMultiDocumentFilingPartyForm: !!form.selectedCases,
    showPrimaryDocumentValid: !!form.primaryDocumentFile,
    showSecondaryDocument,
    showSecondaryDocumentInclusionsForm,
    showSecondaryDocumentValid: !!form.secondaryDocumentFile,
    showSecondaryFilingIncludes,
    showSecondaryParty,
    showSecondarySupportingDocumentValid: !!form.supportingDocumentFile,
    supportingDocumentTypeList,
  };

  if (form.hasSupportingDocuments) {
    const supportingDocuments = [];

    (form.supportingDocuments || []).forEach(item => {
      const showSupportingDocumentFreeText =
        item.supportingDocument &&
        supportingDocumentFreeTextTypes.includes(item.supportingDocument);

      const supportingDocumentTypeIsSelected =
        item.supportingDocument && item.supportingDocument !== '';

      showFilingIncludes = false;
      certificateOfServiceDateFormatted = undefined;
      showFilingIncludes = item.certificateOfService || item.attachments;

      ({ certificateOfServiceDate } = item);
      if (certificateOfServiceDate) {
        certificateOfServiceDateFormatted = applicationContext
          .getUtilities()
          .formatDateString(certificateOfServiceDate, 'MMDDYY');
      }

      supportingDocuments.push({
        certificateOfServiceDateFormatted,
        showFilingIncludes,
        showSupportingDocumentFreeText,
        showSupportingDocumentUpload: supportingDocumentTypeIsSelected,
        showSupportingDocumentValid: !!item.supportingDocumentFile,
      });
    });
    exported = {
      ...exported,
      supportingDocuments,
    };
  }

  if (form.hasSecondarySupportingDocuments) {
    const secondarySupportingDocuments = [];

    (form.secondarySupportingDocuments || []).forEach(item => {
      const showSupportingDocumentFreeText =
        item.supportingDocument &&
        supportingDocumentFreeTextTypes.includes(item.supportingDocument);

      const secondarySupportingDocumentTypeIsSelected =
        item.supportingDocument && item.supportingDocument !== '';

      showFilingIncludes = false;
      certificateOfServiceDateFormatted = undefined;
      showFilingIncludes = item.certificateOfService || item.attachments;

      ({ certificateOfServiceDate } = item);
      if (certificateOfServiceDate) {
        certificateOfServiceDateFormatted = applicationContext
          .getUtilities()
          .formatDateString(certificateOfServiceDate, 'MMDDYY');
      }

      secondarySupportingDocuments.push({
        certificateOfServiceDateFormatted,
        showFilingIncludes,
        showSupportingDocumentFreeText,
        showSupportingDocumentUpload: secondarySupportingDocumentTypeIsSelected,
        showSupportingDocumentValid: !!item.supportingDocumentFile,
      });
    });
    exported = {
      ...exported,
      secondarySupportingDocuments,
    };
  }

  return exported;
};
