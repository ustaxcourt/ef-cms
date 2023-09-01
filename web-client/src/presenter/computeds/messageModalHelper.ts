import { state } from '@web-client/presenter/app.cerebral';

import { ClientApplicationContext } from '@web-client/applicationContext';
import { Get } from 'cerebral';
export const messageModalHelper = (
  get: Get,
  applicationContext: ClientApplicationContext,
) => {
  const {
    CASE_MESSAGE_DOCUMENT_ATTACHMENT_LIMIT,
    CASE_SERVICES_SUPERVISOR_SECTION,
    SECTIONS,
  } = applicationContext.getConstants();

  const sectionListWithoutSupervisorRole = SECTIONS.filter(
    section => section !== CASE_SERVICES_SUPERVISOR_SECTION,
  );

  const caseDetail = get(state.caseDetail);
  const screenMetadata = get(state.screenMetadata);
  const attachments = get(state.modal.form.attachments);
  const draftAttachments = get(state.modal.form.draftAttachments);

  const { correspondence, draftDocuments, formattedDocketEntries } =
    applicationContext
      .getUtilities()
      .getFormattedCaseDetail({ applicationContext, caseDetail });

  const documents: RawDocketEntry[] = [];
  formattedDocketEntries.forEach(entry => {
    if (entry.isFileAttached && entry.isOnDocketRecord) {
      entry.title = entry.descriptionDisplay || entry.documentType;
      documents.push(entry);
    }
  });

  draftDocuments.forEach(entry => {
    entry.title = entry.documentTitle || entry.documentType;
  });

  const currentAttachmentCount = attachments.length + draftAttachments.length;
  const canAddDocument =
    currentAttachmentCount < CASE_MESSAGE_DOCUMENT_ATTACHMENT_LIMIT;
  const shouldShowAddDocumentForm =
    currentAttachmentCount === 0 || screenMetadata.showAddDocumentForm;

  const CHAMBERS_SECTIONS_LABELS = applicationContext
    .getPersistenceGateway()
    .getChambersSectionsLabels();

  const sectionDisplay = key => {
    return (
      {
        adc: 'ADC',
        admissions: 'Admissions',
        chambers: 'Chambers',
        clerkofcourt: 'Clerk of the Court',
        docket: 'Docket',
        floater: 'Floater',
        petitions: 'Petitions',
        reportersOffice: 'Reporter’s Office',
        trialClerks: 'Trial Clerks',
      }[key] || chambersDisplay(key)
    );
  };

  const chambersDisplay = key => {
    return CHAMBERS_SECTIONS_LABELS[key];
  };

  const chambersSections = applicationContext
    .getPersistenceGateway()
    .getChambersSections();

  return {
    chambersDisplay,
    chambersSections,
    correspondence,
    documents,
    draftDocuments,
    hasCorrespondence: correspondence && correspondence.length > 0,
    hasDocuments: documents.length > 0,
    hasDraftDocuments: draftDocuments.length > 0,
    sectionDisplay,
    sectionListWithoutSupervisorRole,
    showAddDocumentForm: canAddDocument && shouldShowAddDocumentForm,
    showAddMoreDocumentsButton: canAddDocument && !shouldShowAddDocumentForm,
    showMessageAttachments: currentAttachmentCount > 0,
  };
};
