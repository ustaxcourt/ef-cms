import { PRACTITIONER_ASSOCIATION_DOCUMENT_TYPES_MAP } from '@shared/business/entities/EntityConstants';
import { state } from '@web-client/presenter/app.cerebral';

export const prepareUploadExternalDocumentsAction = ({ get }: ActionProps) => {
  const form = get(state.form);
  const { consolidatedCases, docketNumber } = get(state.caseDetail);

  let privatePractitioners: any = null;

  let { filers } = form;
  if (
    PRACTITIONER_ASSOCIATION_DOCUMENT_TYPES_MAP.filter(
      d => d.filedByPractitioner,
    )
      .map(item => item.eventCode)
      .includes(form.eventCode)
  ) {
    privatePractitioners = form.practitioner;
  }

  const documentMetadata: any = {
    ...form,
    consolidatedCasesToFileAcross: form.fileAcrossConsolidatedGroup
      ? consolidatedCases
      : undefined,
    docketNumber,
    filers,
    isFileAttached: true,
    privatePractitioners,
  };

  const documentFiles: any = {
    primary: form.primaryDocumentFile,
  };

  if (form.secondaryDocumentFile) {
    documentFiles.secondary = form.secondaryDocumentFile;
    documentMetadata.secondaryDocument.isFileAttached = true;
  }

  if (form.hasSupportingDocuments) {
    form.supportingDocuments.forEach((item, idx) => {
      documentFiles[`primarySupporting${idx}`] = item.supportingDocumentFile;
      item.isFileAttached = !!item.supportingDocumentFile;
    });
  }

  if (form.hasSecondarySupportingDocuments) {
    form.secondarySupportingDocuments.forEach((item, idx) => {
      documentFiles[`secondarySupporting${idx}`] = item.supportingDocumentFile;
      item.isFileAttached = !!item.supportingDocumentFile;
    });
  }

  return {
    documentMetadata,
    files: documentFiles,
  };
};
