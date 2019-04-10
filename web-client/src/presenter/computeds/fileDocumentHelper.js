import { state } from 'cerebral';

export const fileDocumentHelper = get => {
  const { PARTY_TYPES } = get(state.constants);
  const caseDetail = get(state.caseDetail);
  const form = get(state.form);

  const supportingDocumentFreeTextTypes = [
    'Memorandum in Support',
    'Brief in Support',
  ];
  const supportingDocumentUploadTypes = [
    'Affidavit in Support',
    'Declaration in Support',
    'Unsworn Declaration under Penalty of Perjury in Support',
  ];

  const showSupportingDocumentFreeText =
    form.hasSupportingDocuments &&
    supportingDocumentFreeTextTypes.includes(form.supportingDocument);

  const showSupportingSecondaryDocumentFreeText =
    form.hasSupportingSecondaryDocuments &&
    supportingDocumentFreeTextTypes.includes(form.supportingSecondaryDocument);

  const showSupportingDocumentUpload =
    form.hasSupportingDocuments &&
    supportingDocumentUploadTypes.includes(form.supportingDocument);

  const showSupportingSecondaryDocumentUpload =
    form.hasSupportingSecondaryDocuments &&
    supportingDocumentUploadTypes.includes(form.supportingSecondaryDocument);

  const showSecondaryParty =
    caseDetail.partyType === PARTY_TYPES.petitionerSpouse ||
    caseDetail.partyType === PARTY_TYPES.petitionerDeceasedSpouse;

  return {
    showSecondaryParty,
    showSupportingDocumentFreeText,
    showSupportingDocumentUpload,
    showSupportingSecondaryDocumentFreeText,
    showSupportingSecondaryDocumentUpload,
  };
};
