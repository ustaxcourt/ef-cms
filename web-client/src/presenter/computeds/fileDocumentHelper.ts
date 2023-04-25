import { getFilerParties } from './getFilerParties';
import { getSupportingDocumentTypeList } from './addDocketEntryHelper';
import { state } from 'cerebral';

export const supportingDocumentFreeTextTypes = [
  'Affidavit in Support',
  'Declaration in Support',
  'Unsworn Declaration under Penalty of Perjury in Support',
];

export const SUPPORTING_DOCUMENTS_MAX_COUNT = 5;

export const fileDocumentHelper = (get, applicationContext) => {
  const {
    ALLOWLIST_FEATURE_FLAGS,
    AMENDMENT_EVENT_CODES,
    CATEGORY_MAP,
    PARTY_TYPES,
  } = applicationContext.getConstants();
  const caseDetail = get(state.caseDetail);

  const form = get(state.form);
  const validationErrors = get(state.validationErrors);

  const supportingDocumentTypeList =
    getSupportingDocumentTypeList(CATEGORY_MAP);

  const partyValidationError =
    validationErrors.filers || validationErrors.partyIrsPractitioner;

  let { certificateOfServiceDate } = form;
  let certificateOfServiceDateFormatted;
  if (certificateOfServiceDate) {
    certificateOfServiceDateFormatted = applicationContext
      .getUtilities()
      .formatDateString(certificateOfServiceDate, 'MMDDYY');
  }

  const secondaryDocumentCertificateOfServiceDate =
    form.secondaryDocument && form.secondaryDocument.certificateOfServiceDate;
  let secondaryDocumentCertificateOfServiceDateFormatted;
  if (secondaryDocumentCertificateOfServiceDate) {
    secondaryDocumentCertificateOfServiceDateFormatted = applicationContext
      .getUtilities()
      .formatDateString(secondaryDocumentCertificateOfServiceDate, 'MMDDYY');
  }

  const showFilingIncludes = form.certificateOfService || form.attachments;

  const supportingDocumentFlags = getSupportingDocumentFlags(form);

  const { primaryDocument, secondaryDocument } = getPrimarySecondaryDocuments({
    AMENDMENT_EVENT_CODES,
    CATEGORY_MAP,
    form,
  });
  secondaryDocument.certificateOfServiceDateFormatted =
    secondaryDocumentCertificateOfServiceDateFormatted;

  const showSecondaryProperties = getShowSecondaryProperties({
    PARTY_TYPES,
    caseDetail,
    form,
  });

  const formattedFilingParties = getFilerParties({
    caseDetail,
    filersMap: form.filersMap,
  });

  const redactionAcknowledgementEnabled = get(
    state.featureFlags[
      ALLOWLIST_FEATURE_FLAGS.REDACTION_ACKNOWLEDGEMENT_ENABLED.key
    ],
  );

  const exported = {
    certificateOfServiceDateFormatted,
    formattedFilingParties,
    isSecondaryDocumentUploadOptional:
      form.documentType === 'Motion for Leave to File',
    partyValidationError,
    primaryDocument,
    redactionAcknowledgementEnabled,
    secondaryDocument,
    showFilingIncludes,
    showPrimaryDocumentValid: !!form.primaryDocumentFile,
    supportingDocumentTypeList,
    ...showSecondaryProperties,
    ...supportingDocumentFlags,
  };

  if (form.hasSupportingDocuments) {
    const supportingDocuments = (form.supportingDocuments || []).map(item =>
      getFormattedSupportingDocument({ applicationContext, item }),
    );
    Object.assign(exported, { supportingDocuments });
  }

  if (form.hasSecondarySupportingDocuments) {
    const secondarySupportingDocuments = (
      form.secondarySupportingDocuments || []
    ).map(item => getFormattedSupportingDocument({ applicationContext, item }));
    Object.assign(exported, { secondarySupportingDocuments });
  }

  return exported;
};

const getSupportingDocumentFlags = form => {
  const supportingDocumentCount =
    (form.supportingDocuments && form.supportingDocuments.length) || 0;
  const showAddSupportingDocuments =
    !supportingDocumentCount ||
    supportingDocumentCount < SUPPORTING_DOCUMENTS_MAX_COUNT;
  const showAddSupportingDocumentsLimitReached = !!(
    supportingDocumentCount &&
    supportingDocumentCount >= SUPPORTING_DOCUMENTS_MAX_COUNT
  );

  const secondarySupportingDocumentCount =
    (form.secondarySupportingDocuments &&
      form.secondarySupportingDocuments.length) ||
    0;
  const showAddSecondarySupportingDocuments =
    (!secondarySupportingDocumentCount ||
      secondarySupportingDocumentCount < SUPPORTING_DOCUMENTS_MAX_COUNT) &&
    (form.documentType !== 'Motion for Leave to File' ||
      !!form.secondaryDocumentFile);
  const showAddSecondarySupportingDocumentsLimitReached = !!(
    secondarySupportingDocumentCount &&
    secondarySupportingDocumentCount >= SUPPORTING_DOCUMENTS_MAX_COUNT
  );
  return {
    showAddSecondarySupportingDocuments,
    showAddSecondarySupportingDocumentsLimitReached,
    showAddSupportingDocuments,
    showAddSupportingDocumentsLimitReached,
  };
};

const getShowSecondaryProperties = ({ caseDetail, form, PARTY_TYPES }) => {
  const showSecondaryParty = [
    PARTY_TYPES.petitionerSpouse,
    PARTY_TYPES.petitionerDeceasedSpouse,
  ].includes(caseDetail.partyType);

  const showSecondaryFilingIncludes =
    form.secondaryDocument &&
    (form.secondaryDocument.certificateOfService ||
      form.secondaryDocument.attachments);

  const showSecondaryDocumentInclusionsForm =
    form.documentType !== 'Motion for Leave to File' ||
    !!form.secondaryDocumentFile;

  return {
    showSecondaryDocument:
      form.secondaryDocument && form.secondaryDocument.documentTitle,
    showSecondaryDocumentInclusionsForm,
    showSecondaryDocumentValid: !!form.secondaryDocumentFile,
    showSecondaryFilingIncludes,
    showSecondaryParty,
    showSecondarySupportingDocumentValid: !!form.supportingDocumentFile,
  };
};

const getPrimarySecondaryDocuments = ({
  AMENDMENT_EVENT_CODES,
  CATEGORY_MAP,
  form,
}) => {
  const objectionDocumentTypes = [
    ...CATEGORY_MAP['Motion'].map(entry => entry.documentType),
    'Motion to Withdraw Counsel (filed by petitioner)',
    'Motion to Withdraw as Counsel',
    'Application to Take Deposition',
  ];

  const primarySecondaryDocuments = {
    primaryDocument: {
      showObjection:
        objectionDocumentTypes.includes(form.documentType) ||
        (AMENDMENT_EVENT_CODES.includes(form.eventCode) &&
          objectionDocumentTypes.includes(form.previousDocument?.documentType)),
    },
    secondaryDocument: {
      showObjection:
        form.secondaryDocument &&
        form.secondaryDocumentFile &&
        (objectionDocumentTypes.includes(form.secondaryDocument.documentType) ||
          (AMENDMENT_EVENT_CODES.includes(form.secondaryDocument.eventCode) &&
            objectionDocumentTypes.includes(
              form.secondaryDocument.previousDocument?.documentType,
            ))),
    },
  };
  return primarySecondaryDocuments;
};

const getFormattedSupportingDocument = ({ applicationContext, item }) => {
  let certificateOfServiceDateFormatted;

  if (item.certificateOfServiceDate) {
    certificateOfServiceDateFormatted = applicationContext
      .getUtilities()
      .formatDateString(item.certificateOfServiceDate, 'MMDDYY');
  }
  return {
    certificateOfServiceDateFormatted,
    showFilingIncludes: item.certificateOfService || item.attachments,
    showSupportingDocumentFreeText:
      item.supportingDocument &&
      supportingDocumentFreeTextTypes.includes(item.supportingDocument),
    showSupportingDocumentUpload:
      item.supportingDocument && item.supportingDocument !== '',
    showSupportingDocumentValid: !!item.supportingDocumentFile,
  };
};
