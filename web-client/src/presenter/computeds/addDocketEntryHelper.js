import { find, includes, orderBy } from 'lodash';
import { state } from 'cerebral';

import {
  getOptionsForCategory,
  getPreviouslyFiledDocuments,
} from './selectDocumentTypeHelper';
import { supportingDocumentFreeTextTypes } from './fileDocumentHelper';

const getInternalDocumentTypes = typeMap => {
  let filteredTypeList = [];
  Object.keys(typeMap).forEach(category => {
    filteredTypeList.push(...typeMap[category]);
  });
  filteredTypeList = filteredTypeList.map(e => {
    return { label: e.documentType, value: e.eventCode };
  });
  return orderBy(filteredTypeList, ['label'], ['asc']);
};

export const addDocketEntryHelper = (get, applicationContext) => {
  const { PARTY_TYPES, INTERNAL_CATEGORY_MAP } = get(state.constants);
  const caseDetail = get(state.caseDetail);
  if (!caseDetail.partyType) {
    return {};
  }
  const documentIdWhitelist = get(state.screenMetadata.filedDocumentIds);
  const form = get(state.form);
  const validationErrors = get(state.validationErrors);
  const showSecondaryParty =
    caseDetail.partyType === PARTY_TYPES.petitionerSpouse ||
    caseDetail.partyType === PARTY_TYPES.petitionerDeceasedSpouse;

  const internalDocumentTypes = getInternalDocumentTypes(INTERNAL_CATEGORY_MAP);

  const supportingDocumentTypeList = INTERNAL_CATEGORY_MAP[
    'Supporting Document'
  ].map(entry => {
    entry.documentTypeDisplay = entry.documentType.replace(
      /\sin\sSupport$/i,
      '',
    );
    return entry;
  });

  const objectionDocumentTypes = [
    ...INTERNAL_CATEGORY_MAP['Motion'].map(entry => {
      return entry.documentType;
    }),
    'Motion to Withdraw Counsel (filed by petitioner)',
    'Motion to Withdraw as Counsel',
    'Application to Take Deposition',
  ];

  const partyValidationError =
    validationErrors.partyPrimary ||
    validationErrors.partySecondary ||
    validationErrors.partyRespondent;

  const certificateOfServiceDate = form.certificateOfServiceDate;
  let certificateOfServiceDateFormatted;
  if (certificateOfServiceDate) {
    certificateOfServiceDateFormatted = applicationContext
      .getUtilities()
      .formatDateString(certificateOfServiceDate, 'MMDDYY');
  }

  const previouslyFiledWizardDocuments = getPreviouslyFiledDocuments(
    caseDetail,
    documentIdWhitelist,
  );

  const selectedEventCode = form.eventCode;
  const secondarySelectedEventCode = get(
    state.form.secondaryDocument.eventCode,
  );

  let categoryInformation;
  let secondaryCategoryInformation;

  find(
    INTERNAL_CATEGORY_MAP,
    entries =>
      (categoryInformation = find(entries, { eventCode: selectedEventCode })),
  );

  find(
    INTERNAL_CATEGORY_MAP,
    entries =>
      (secondaryCategoryInformation = find(entries, {
        eventCode: secondarySelectedEventCode,
      })),
  );

  const optionsForCategory = getOptionsForCategory(
    caseDetail,
    categoryInformation,
  );

  const secondaryOptionsForCategory = getOptionsForCategory(
    caseDetail,
    secondaryCategoryInformation,
  );

  const previousDocument =
    form.previousDocument &&
    find(
      caseDetail.documents,
      doc =>
        includes(documentIdWhitelist, doc.documentId) &&
        (doc.documentTitle || doc.documentType) === form.previousDocument,
    );
  const showSupportingInclusions =
    previousDocument && previousDocument.relationship !== 'secondaryDocument';

  if (optionsForCategory.showSecondaryDocumentSelect) {
    optionsForCategory.showSecondaryDocumentSelect = false;
    optionsForCategory.showSecondaryDocumentForm = true;
  }

  let showPractitionerParty = false;
  let practitionerNames = [];
  if (caseDetail.practitioners && caseDetail.practitioners.length) {
    showPractitionerParty = true;

    caseDetail.practitioners.forEach(practitioner => {
      practitionerNames.push(practitioner.name);
    });
  }

  return {
    certificateOfServiceDateFormatted,
    internalDocumentTypes,
    partyValidationError,
    practitionerNames,
    previouslyFiledWizardDocuments,
    primary: optionsForCategory,
    secondary: secondaryOptionsForCategory,
    showObjection: objectionDocumentTypes.includes(form.documentType),
    showPractitionerParty,
    showPrimaryDocumentValid: !!form.primaryDocumentFile,
    showRespondentParty:
      caseDetail.respondents && caseDetail.respondents.length,
    showSecondaryDocumentValid: !!form.secondaryDocumentFile,
    showSecondaryParty,
    showSecondarySupportingDocumentValid: !!form.secondarySupportingDocumentFile,
    showSupportingDocumentFreeText: supportingDocumentFreeTextTypes.includes(
      form.documentType,
    ),
    showSupportingDocumentSelect: form.documentType && form.documentType !== '',
    showSupportingDocumentValid: !!form.supportingDocumentFile,
    showSupportingInclusions,
    supportingDocumentTypeList,
  };
};
