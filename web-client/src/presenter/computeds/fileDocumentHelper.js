import { state } from 'cerebral';

export const fileDocumentHelper = get => {
  const caseDetail = get(state.caseDetail);
  const form = get(state.form);

  const showSupportingDocumentFreeText =
    form.supportingDocument &&
    (form.supportingDocument === 'Memorandum in Support' ||
      form.supportingDocument === 'Brief in Support');

  const showSupportingDocumentUpload =
    form.supportingDocument &&
    (form.supportingDocument === 'Affidavit in Support' ||
      form.supportingDocument === 'Declaration in Support' ||
      form.supportingDocument ===
        'Unsworn Declaration under Penalty of Perjury in Support');

  const showSupportingSecondaryDocumentFreeText =
    form.supportingSecondaryDocument &&
    (form.supportingSecondaryDocument === 'Memorandum in Support' ||
      form.supportingSecondaryDocument === 'Brief in Support');

  const showSupportingSecondaryDocumentUpload =
    form.supportingSecondaryDocument &&
    (form.supportingSecondaryDocument === 'Affidavit in Support' ||
      form.supportingSecondaryDocument === 'Declaration in Support' ||
      form.supportingSecondaryDocument ===
        'Unsworn Declaration under Penalty of Perjury in Support');

  const showSecondaryParty =
    caseDetail.partyType === 'Petitioner & Spouse' ||
    caseDetail.partyType === 'Petitioner & Deceased Spouse';

  return {
    showSecondaryParty,
    showSupportingDocumentFreeText,
    showSupportingDocumentUpload,
    showSupportingSecondaryDocumentFreeText,
    showSupportingSecondaryDocumentUpload,
  };
};
