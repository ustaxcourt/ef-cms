import { state } from 'cerebral';

export const fileDocumentHelper = get => {
  const { PARTY_TYPES, CATEGORY_MAP } = get(state.constants);
  const caseDetail = get(state.caseDetail);
  const form = get(state.form);
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
    'Memorandum in Support',
    'Brief in Support',
  ];
  const supportingDocumentUploadTypes = [
    'Affidavit in Support',
    'Declaration in Support',
    'Unsworn Declaration under Penalty of Perjury in Support',
  ];

  let exported = { showSecondaryParty, supportingDocumentTypeList };

  if (form.hasSupportingDocuments) {
    const showSupportingDocumentFreeText =
      form.hasSupportingDocuments &&
      supportingDocumentFreeTextTypes.includes(form.supportingDocument);

    const showSupportingDocumentUpload =
      form.hasSupportingDocuments &&
      supportingDocumentUploadTypes.includes(form.supportingDocument);

    exported = {
      ...exported,
      showSupportingDocumentFreeText,
      showSupportingDocumentUpload,
    };
  }

  if (form.hasSupportingSecondaryDocuments) {
    const showSupportingSecondaryDocumentFreeText =
      form.hasSupportingSecondaryDocuments &&
      supportingDocumentFreeTextTypes.includes(
        form.supportingSecondaryDocument,
      );

    const showSupportingSecondaryDocumentUpload =
      form.hasSupportingSecondaryDocuments &&
      supportingDocumentUploadTypes.includes(form.supportingSecondaryDocument);

    exported = {
      ...exported,
      showSupportingSecondaryDocumentFreeText,
      showSupportingSecondaryDocumentUpload,
    };
  }

  return exported;
};
