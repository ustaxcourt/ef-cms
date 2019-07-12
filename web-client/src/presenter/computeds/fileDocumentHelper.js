import { state } from 'cerebral';

export const supportingDocumentFreeTextTypes = [
  'Affidavit in Support',
  'Declaration in Support',
  'Unsworn Declaration under Penalty of Perjury in Support',
];

export const fileDocumentHelper = (get, applicationContext) => {
  const { CATEGORY_MAP, PARTY_TYPES } = get(state.constants);
  const caseDetail = get(state.caseDetail);
  if (!caseDetail.partyType) {
    return {};
  }
  const form = get(state.form);
  const validationErrors = get(state.validationErrors);
  const showSecondaryParty =
    caseDetail.partyType === PARTY_TYPES.petitionerSpouse ||
    caseDetail.partyType === PARTY_TYPES.petitionerDeceasedSpouse;
  const showPractitionerParty =
    caseDetail.practitioners && caseDetail.practitioners.length > 0;

  const supportingDocumentTypeList = CATEGORY_MAP['Supporting Document'].map(
    entry => {
      entry.documentTypeDisplay = entry.documentType.replace(
        /\sin\sSupport$/i,
        '',
      );
      return entry;
    },
  );

  const objectionDocumentTypes = [
    ...CATEGORY_MAP['Motion'].map(entry => {
      return entry.documentType;
    }),
    'Motion to Withdraw Counsel (filed by petitioner)',
    'Motion to Withdraw as Counsel',
    'Application to Take Deposition',
  ];

  const partyValidationError =
    validationErrors.partyPrimary ||
    validationErrors.partySecondary ||
    validationErrors.partyRespondent;

  const { certificateOfServiceDate } = form;
  let certificateOfServiceDateFormatted;
  if (certificateOfServiceDate) {
    certificateOfServiceDateFormatted = applicationContext
      .getUtilities()
      .formatDateString(certificateOfServiceDate, 'MMDDYY');
  }

  const showFilingIncludes =
    form.certificateOfService || form.exhibits || form.attachments;

  const showFilingNotIncludes =
    !form.certificateOfService ||
    !form.exhibits ||
    !form.attachments ||
    !form.hasSupportingDocuments;

  const showSecondaryFilingNotIncludes =
    form.secondaryDocumentFile && !form.hasSecondarySupportingDocuments;

  let exported = {
    certificateOfServiceDateFormatted,
    isSecondaryDocumentUploadOptional:
      form.documentType === 'Motion for Leave to File',
    partyValidationError,
    showFilingIncludes,
    showFilingNotIncludes,
    showObjection: objectionDocumentTypes.includes(form.documentType),
    showPractitionerParty,
    showPrimaryDocumentValid: !!form.primaryDocumentFile,
    showSecondaryDocumentValid: !!form.secondaryDocumentFile,
    showSecondaryFilingNotIncludes,
    showSecondaryParty,
    showSecondarySupportingDocumentValid: !!form.secondarySupportingDocumentFile,
    showSupportingDocumentValid: !!form.supportingDocumentFile,
    supportingDocumentTypeList,
  };

  if (form.hasSupportingDocuments) {
    const showSupportingDocumentFreeText =
      form.hasSupportingDocuments &&
      supportingDocumentFreeTextTypes.includes(form.supportingDocument);

    const supportingDocumentTypeIsSelected =
      form.supportingDocument && form.supportingDocument !== '';

    exported = {
      ...exported,
      showSupportingDocumentFreeText,
      showSupportingDocumentUpload: supportingDocumentTypeIsSelected,
    };
  }

  if (form.hasSecondarySupportingDocuments) {
    const showSecondarySupportingDocumentFreeText =
      form.hasSecondarySupportingDocuments &&
      supportingDocumentFreeTextTypes.includes(
        form.secondarySupportingDocument,
      );

    const secondarySupportingDocumentTypeIsSelected =
      form.secondarySupportingDocument &&
      form.secondarySupportingDocument !== '';

    exported = {
      ...exported,
      showSecondarySupportingDocumentFreeText,
      showSecondarySupportingDocumentUpload: secondarySupportingDocumentTypeIsSelected,
    };
  }

  return exported;
};
