import { getDocumentTypesForSelect } from './internalTypesHelper';
import { getFilerParties } from './getFilerParties';
import { state } from 'cerebral';

export const requestAccessHelper = (get, applicationContext) => {
  const { PARTY_TYPES, USER_ROLES } = applicationContext.getConstants();
  const user = applicationContext.getCurrentUser();
  const caseDetail = get(state.caseDetail);
  const form = get(state.form);
  const documentType = get(state.form.documentType);
  const showSecondaryParty =
    caseDetail.partyType === PARTY_TYPES.petitionerSpouse ||
    caseDetail.partyType === PARTY_TYPES.petitionerDeceasedSpouse;

  const { certificateOfServiceDate } = form;
  let certificateOfServiceDateFormatted;
  if (certificateOfServiceDate) {
    certificateOfServiceDateFormatted = applicationContext
      .getUtilities()
      .formatDateString(certificateOfServiceDate, 'MMDDYY');
  }

  const documents = [
    {
      documentTitleTemplate: 'Entry of Appearance for [Petitioner Names]',
      documentType: 'Entry of Appearance',
      eventCode: 'EA',
      scenario: 'Standard',
    },
    {
      documentTitleTemplate: 'Substitution of Counsel for [Petitioner Names]',
      documentType: 'Substitution of Counsel',
      eventCode: 'SOC',
      scenario: 'Standard',
    },
  ];

  if (user.role === USER_ROLES.privatePractitioner) {
    documents.push(
      {
        documentTitleTemplate:
          'Limited Entry of Appearance for [Petitioner Names]',
        documentType: 'Limited Entry of Appearance',
        eventCode: 'LEA',
        scenario: 'Standard',
      },
      {
        documentTitleTemplate:
          'Motion to Substitute Parties and Change Caption',
        documentType: 'Motion to Substitute Parties and Change Caption',
        eventCode: 'M107',
        scenario: 'Standard',
      },
      {
        documentTitleTemplate: 'Notice of Intervention',
        documentType: 'Notice of Intervention',
        eventCode: 'NOI',
        scenario: 'Standard',
      },
      {
        documentTitleTemplate: 'Notice of Election to Participate',
        documentType: 'Notice of Election to Participate',
        eventCode: 'NOEP',
        scenario: 'Standard',
      },
      {
        documentTitleTemplate: 'Notice of Election to Intervene',
        documentType: 'Notice of Election to Intervene',
        eventCode: 'NOEI',
        scenario: 'Standard',
      },
    );
  }

  const documentsForSelect = getDocumentTypesForSelect(documents);

  const documentWithAttachments = [
    'Motion to Substitute Parties and Change Caption',
    'Notice of Intervention',
    'Notice of Election to Participate',
    'Notice of Election to Intervene',
  ].includes(documentType);

  const documentWithObjections = [
    'Substitution of Counsel',
    'Motion to Substitute Parties and Change Caption',
  ].includes(documentType);

  const documentWithSupportingDocuments = [
    'Motion to Substitute Parties and Change Caption',
  ].includes(documentType);

  const showFilingIncludes =
    form.certificateOfService || (documentWithAttachments && form.attachments);

  const showFilingNotIncludes =
    !form.certificateOfService ||
    (documentWithAttachments && !form.attachments) ||
    (documentWithSupportingDocuments && !form.hasSupportingDocuments);

  const showPartiesRepresenting = user.role === USER_ROLES.privatePractitioner;

  let representingPartiesNames = getFilerParties({
    caseDetail,
    filersMap: form.filersMap,
  });

  let exported = {
    certificateOfServiceDateFormatted,
    documentWithAttachments,
    documentWithObjections,
    documentWithSupportingDocuments,
    documents,
    documentsForSelect,
    representingPartiesNames,
    showFilingIncludes,
    showFilingNotIncludes,
    showPartiesRepresenting,
    showPrimaryDocumentValid: !!form.primaryDocumentFile,
    showSecondaryParty,
  };

  return exported;
};
