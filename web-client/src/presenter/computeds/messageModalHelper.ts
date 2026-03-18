import { state } from '@web-client/presenter/app.cerebral';

import { Get } from 'cerebral';
import { type ClientApplicationContext } from '@web-client/applicationContext';
import { type RawCorrespondence } from '@shared/business/entities/Correspondence';

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
  for (const entry of formattedDocketEntries) {
    if (entry.isFileAttached && entry.isOnDocketRecord) {
      documents.push({
        ...entry,
        isAlreadyAttached: computeIsAlreadyAttached(entry),
        title:
          entry.descriptionDisplay ||
          entry.documentTitle ||
          entry.documentType ||
          '',
      });
    }
  }

  const draftDocs: (RawDocketEntry & {
    isAlreadyAttached: boolean;
    title: string;
  })[] = [];
  for (const entry of draftDocuments) {
    draftDocs.push({
      ...entry,
      isAlreadyAttached: computeIsAlreadyAttached(entry),
      title: entry.documentTitle || entry.documentType || '',
    });
  }

  const corrs: (RawCorrespondence & { isAlreadyAttached: boolean })[] = [];
  for (const corr of correspondence) {
    corrs.push({
      ...corr,
      isAlreadyAttached: currentAttachments.some(
        attachment => attachment.docketEntryId === corr.correspondenceId,
      ),
    });
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
    correspondence: corrs,
    documents,
    draftDocuments: draftDocs,
    hasCorrespondence: corrs && corrs.length > 0,
    hasDocuments: documents.length > 0,
    hasDraftDocuments: draftDocs.length > 0,
    sectionDisplay,
    sectionListWithoutSupervisorRole,
    showAddDocumentForm: canAddDocument && shouldShowAddDocumentForm,
    showAddMoreDocumentsButton: canAddDocument && !shouldShowAddDocumentForm,
    showMessageAttachments: currentAttachmentCount > 0,
  };
};
