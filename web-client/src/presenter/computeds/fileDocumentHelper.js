import { state } from 'cerebral';
import moment from 'moment';

export const fileDocumentHelper = get => {
  const { PARTY_TYPES, CATEGORY_MAP } = get(state.constants);
  const caseDetail = get(state.caseDetail);
  const form = get(state.form);
  const validationErrors = get(state.validationErrors);
  const showSecondaryParty =
    caseDetail.partyType === PARTY_TYPES.petitionerSpouse ||
    caseDetail.partyType === PARTY_TYPES.petitionerDeceasedSpouse;

  const supportingDocumentTypeList = CATEGORY_MAP['Supporting Document'].map(
    entry => {
      entry.documentTypeDisplay = entry.documentType.replace(
        /\sin\sSupport$/i,
        '',
      );
      return entry;
    },
  );

  const supportingDocumentFreeTextTypes = [
    'Affidavit in Support',
    'Declaration in Support',
    'Unsworn Declaration under Penalty of Perjury in Support',
  ];
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

  const certificateOfServiceDate = form.certificateOfServiceDate;
  let certificateOfServiceDateFormatted;
  if (certificateOfServiceDate) {
    certificateOfServiceDateFormatted = moment
      .utc(certificateOfServiceDate)
      .format('L');
  }

  const showFilingIncludes =
    form.certificateOfService || form.exhibits || form.attachments;

  const showFilingNotIncludes =
    !form.certificateOfService || !form.exhibits || !form.attachments;

  let exported = {
    certificateOfServiceDateFormatted,
    isSecondaryDocumentUploadOptional:
      form.documentType === 'Motion for Leave to File',
    partyValidationError,
    showFilingIncludes,
    showFilingNotIncludes,
    showObjection: objectionDocumentTypes.includes(form.documentType),
    showPrimaryDocumentValid: !!form.primaryDocumentFile,
    showSecondaryDocumentValid: !!form.secondaryDocumentFile,
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
