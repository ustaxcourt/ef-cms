import { isEmpty } from 'lodash';
import { state } from 'cerebral';

export const addCourtIssuedDocketEntryHelper = (get, applicationContext) => {
  const {
    COURT_ISSUED_EVENT_CODES,
    EVENT_CODES_REQUIRING_SIGNATURE,
    UNSERVABLE_EVENT_CODES,
    USER_ROLES,
  } = applicationContext.getConstants();
  const documentId = get(state.documentId);
  const caseDetail = applicationContext
    .getUtilities()
    .setServiceIndicatorsForCase({
      ...get(state.caseDetail),
    });

  const form = get(state.form);

  const caseDocument = caseDetail.documents.find(
    d => d.documentId === documentId,
  );

  const user = applicationContext.getCurrentUser();

  const eventCodes = COURT_ISSUED_EVENT_CODES;

  const documentTypes = eventCodes.map(type => ({
    ...type,
    label: type.documentType,
    value: type.eventCode,
  }));

  const petitioners = [caseDetail.contactPrimary];

  if (!isEmpty(caseDetail.contactSecondary)) {
    petitioners.push(caseDetail.contactSecondary);
  }

  const serviceParties = [
    ...petitioners.map(petitioner => ({
      ...petitioner,
      displayName: `${petitioner.name}, Petitioner`,
    })),
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

  const formattedDocumentTitle = `${form.generatedDocumentTitle}${
    form.attachments ? ' (Attachment(s))' : ''
  }`;

  const showSaveAndServeButton =
    (!!caseDocument.signedAt ||
      !EVENT_CODES_REQUIRING_SIGNATURE.includes(form.eventCode)) &&
    !UNSERVABLE_EVENT_CODES.includes(form.eventCode);

  const showDocumentNotSignedAlert =
    !caseDocument.signedAt &&
    EVENT_CODES_REQUIRING_SIGNATURE.includes(form.eventCode);

  return {
    documentTypes,
    formattedDocumentTitle,
    serviceParties,
    showDocumentNotSignedAlert,
    showSaveAndServeButton,
    showServiceStamp,
  };
};
