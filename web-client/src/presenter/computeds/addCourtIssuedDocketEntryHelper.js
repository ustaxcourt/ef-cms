import { isEmpty } from 'lodash';
import { state } from 'cerebral';

export const addCourtIssuedDocketEntryHelper = (get, applicationContext) => {
  const {
    COURT_ISSUED_EVENT_CODES,
    USER_ROLES,
  } = applicationContext.getConstants();
  const caseDetail = applicationContext
    .getUtilities()
    .setServiceIndicatorsForCase({
      ...get(state.caseDetail),
    });

  const form = get(state.form);

  const user = applicationContext.getCurrentUser();

  let eventCodes = COURT_ISSUED_EVENT_CODES;

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

  return {
    documentTypes,
    formattedDocumentTitle,
    serviceParties,
    showServiceStamp,
  };
};
