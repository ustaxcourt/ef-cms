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

  const showAddSupportingDocuments =
    !form.supportingDocumentCount || form.supportingDocumentCount < 5;

  const showAddSecondarySupportingDocuments =
    !form.secondarySupportingDocumentCount ||
    form.secondarySupportingDocumentCount < 5;

  let exported = {
    certificateOfServiceDateFormatted,
    isSecondaryDocumentUploadOptional:
      form.documentType === 'Motion for Leave to File',
    partyValidationError,
    primaryDocument: {
      showObjection: objectionDocumentTypes.includes(form.documentType),
    },
    secondaryDocument: {
      showObjection:
        form.secondaryDocument &&
        objectionDocumentTypes.includes(form.secondaryDocument.documentType),
    },
    showAddSecondarySupportingDocuments,
    showAddSupportingDocuments,
    showFilingIncludes,
    showFilingNotIncludes,
    showPractitionerParty,
    showPrimaryDocumentValid: !!form.primaryDocumentFile,
    showSecondaryDocumentValid: !!form.secondaryDocumentFile,
    showSecondaryFilingNotIncludes,
    showSecondaryParty,
    showSecondarySupportingDocumentValid: !!form.secondarySupportingDocumentFile,
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

      supportingDocuments.push({
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
      const showSecondarySupportingDocumentFreeText =
        item.secondarySupportingDocument &&
        supportingDocumentFreeTextTypes.includes(
          item.secondarySupportingDocument,
        );

      const secondarySupportingDocumentTypeIsSelected =
        item.secondarySupportingDocument &&
        item.secondarySupportingDocument !== '';

      secondarySupportingDocuments.push({
        showSecondarySupportingDocumentFreeText,
        showSecondarySupportingDocumentUpload: secondarySupportingDocumentTypeIsSelected,
        showSecondarySupportingDocumentValid: !!item.secondarySupportingDocumentFile,
      });
    });
    exported = {
      ...exported,
      secondarySupportingDocuments,
    };
  }

  return exported;
};
