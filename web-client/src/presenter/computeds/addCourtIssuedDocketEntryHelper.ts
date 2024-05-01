import { ClientApplicationContext } from '@web-client/applicationContext';
import { DocketEntry } from '@shared/business/entities/DocketEntry';
import { Get } from 'cerebral';
import { state } from '@web-client/presenter/app.cerebral';

export const addCourtIssuedDocketEntryHelper = (
  get: Get,
  applicationContext: ClientApplicationContext,
): any => {
  const {
    COURT_ISSUED_EVENT_CODES,
    SYSTEM_GENERATED_DOCUMENT_TYPES,
    USER_ROLES,
  } = applicationContext.getConstants();
  const caseDetail = applicationContext
    .getUtilities()
    .setServiceIndicatorsForCase({
      ...get(state.caseDetail),
    });

  const form = get(state.form);

  const user = applicationContext.getCurrentUser();

  const eventCodes = COURT_ISSUED_EVENT_CODES;

  const documentTypes = eventCodes.map(type => ({
    ...type,
    label: type.documentType,
    value: type.eventCode,
  }));

  const petitioners = applicationContext
    .getUtilities()
    .getFormattedPartiesNameAndTitle({ petitioners: caseDetail.petitioners });

  const serviceParties = [
    ...petitioners,
    ...caseDetail.privatePractitioners.map(practitioner => ({
      ...practitioner,
      displayName: `${practitioner.name}, Petitioner Counsel`,
    })),
    ...caseDetail.irsPractitioners.map(practitioner => ({
      ...practitioner,
      displayName: `${practitioner.name}, Respondent Counsel`,
    })),
  ];

  const selectedEventCode = get(state.form.eventCode);
  const showServiceStamp =
    selectedEventCode === 'O' && user.role !== USER_ROLES.petitionsClerk;

  const formattedDocumentTitle = `${form.generatedDocumentTitle || ''}${
    form.attachments ? ' (Attachment(s))' : ''
  }`;

  const eventCodeIsUnservable = DocketEntry.isUnservable({
    eventCode: form.eventCode,
  });

  const eventCodesNotRequiringAttachmentsAndService = ['TCRP'];

  const showAttachmentAndServiceFields =
    !eventCodesNotRequiringAttachmentsAndService.includes(selectedEventCode);

  const canAllowDocumentServiceForCase = applicationContext
    .getUtilities()
    .canAllowDocumentServiceForCase(caseDetail);
  const showServiceWarning = !canAllowDocumentServiceForCase;
  const showReceivedDate = eventCodeIsUnservable;
  const showSaveAndServeButton =
    !eventCodeIsUnservable && canAllowDocumentServiceForCase;

  const showDocumentTypeDropdown =
    form.eventCode !==
    SYSTEM_GENERATED_DOCUMENT_TYPES.noticeOfDocketChange.eventCode;

  return {
    documentTypes,
    formattedDocumentTitle,
    serviceParties,
    showAttachmentAndServiceFields,
    showDocumentTypeDropdown,
    showReceivedDate,
    showSaveAndServeButton,
    showServiceStamp,
    showServiceWarning,
  };
};
