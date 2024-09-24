import { state } from '@web-client/presenter/app.cerebral';

import { ClientApplicationContext } from '@web-client/applicationContext';
import { Get } from 'cerebral';
export const messageModalHelper = (
  get: Get,
  applicationContext: ClientApplicationContext,
): any => {
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
  const user = get(state.user);
  const currentAttachments = [...attachments, ...draftAttachments];
  const judgesChambers = get(state.judgesChambers) || [];

  const computeIsAlreadyAttached = doc =>
    currentAttachments.some(
      attachment => attachment.documentId === doc.docketEntryId,
    );

  const { correspondence, draftDocuments, formattedDocketEntries } =
    applicationContext.getUtilities().getFormattedCaseDetail({
      applicationContext,
      authorizedUser: user,
      caseDetail,
    });

  const documents: (RawDocketEntry & {
    isAlreadyAttached: boolean;
    title: string;
  })[] = [];
  for (let entry of formattedDocketEntries) {
    if (entry.isFileAttached && entry.isOnDocketRecord) {
      entry.title = entry.descriptionDisplay || entry.documentType;
      entry.isAlreadyAttached = computeIsAlreadyAttached(entry);

      documents.push(entry);
    }
  }

  for (let entry of draftDocuments) {
    entry.title = entry.documentTitle || entry.documentType;
    entry.isAlreadyAttached = computeIsAlreadyAttached(entry);
  }

  for (let corr of correspondence) {
    corr.isAlreadyAttached = currentAttachments.some(
      attachment => attachment.docketEntryId === corr.correspondenceId,
    );
  }

  const currentAttachmentCount = currentAttachments.length;
  const canAddDocument =
    currentAttachmentCount < CASE_MESSAGE_DOCUMENT_ATTACHMENT_LIMIT;
  const shouldShowAddDocumentForm =
    currentAttachmentCount === 0 || screenMetadata.showAddDocumentForm;

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

  const chambersSections = judgesChambers.map(chambers => {
    return chambers.section;
  });

  const chambersDisplay = key => {
    return judgesChambers?.filter(s => s.section === key)[0]?.label;
  };

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
