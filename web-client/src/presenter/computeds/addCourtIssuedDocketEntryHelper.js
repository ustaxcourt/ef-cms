import { state } from 'cerebral';

export const addCourtIssuedDocketEntryHelper = (get, applicationContext) => {
  const {
    COURT_ISSUED_EVENT_CODES,
    SYSTEM_GENERATED_DOCUMENT_TYPES,
    UNSERVABLE_EVENT_CODES,
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

  const eventCodeIsUnservable = !!UNSERVABLE_EVENT_CODES.includes(
    form.eventCode,
  );

  const showReceivedDate = eventCodeIsUnservable;
  const showSaveAndServeButton = !eventCodeIsUnservable;

  const showDocumentTypeDropdown =
    form.eventCode !==
    SYSTEM_GENERATED_DOCUMENT_TYPES.noticeOfDocketChange.eventCode;

  return {
    documentTypes,
    formattedDocumentTitle,
    serviceParties,
    showDocumentTypeDropdown,
    showReceivedDate,
    showSaveAndServeButton,
    showServiceStamp,
  };
};
