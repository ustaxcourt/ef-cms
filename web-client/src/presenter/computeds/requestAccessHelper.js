import { state } from 'cerebral';

export const requestAccessHelper = (get, applicationContext) => {
  const { PARTY_TYPES } = get(state.constants);
  const caseDetail = get(state.caseDetail);
  const userRole = get(state.user.role);
  const form = get(state.form);
  const documentType = get(state.form.documentType);
  const validationErrors = get(state.validationErrors);
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

  if (userRole === 'practitioner') {
    documents.push(
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

  const shouldShowExhibits = !['practitioner', 'respondent'].includes(userRole);

  const documentWithExhibits =
    [
      'Motion to Substitute Parties and Change Caption',
      'Notice of Intervention',
      'Notice of Election to Participate',
      'Notice of Election to Intervene',
    ].includes(documentType) && shouldShowExhibits;

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

  const partyValidationError =
    validationErrors.representingPrimary ||
    validationErrors.representingSecondary;

  const showFilingIncludes =
    form.certificateOfService ||
    (documentWithExhibits && form.exhibits) ||
    (documentWithAttachments && form.attachments);

  const showFilingNotIncludes =
    !form.certificateOfService ||
    (documentWithExhibits && !form.exhibits) ||
    (documentWithAttachments && !form.attachments) ||
    (documentWithSupportingDocuments && !form.hasSupportingDocuments);

  const showPartiesRepresenting = userRole === 'practitioner';

  let exported = {
    certificateOfServiceDateFormatted,
    documentWithAttachments,
    documentWithExhibits,
    documentWithObjections,
    documentWithSupportingDocuments,
    documents,
    partyValidationError,
    showFilingIncludes,
    showFilingNotIncludes,
    showPartiesRepresenting,
    showPrimaryDocumentValid: !!form.primaryDocumentFile,
    showSecondaryParty,
  };

  return exported;
};
