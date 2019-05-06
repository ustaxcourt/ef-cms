import { find, orderBy } from 'lodash';
import { state } from 'cerebral';
import moment from 'moment';

import {
  getOptionsForCategory,
  getPreviouslyFiledDocuments,
} from './selectDocumentTypeHelper';

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

export const addDocketEntryHelper = get => {
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
    certificateOfServiceDateFormatted = moment
      .utc(certificateOfServiceDate)
      .format('L');
  }

  const previouslyFiledWizardDocuments = getPreviouslyFiledDocuments(
    caseDetail,
    documentIdWhitelist,
  );

  const selectedEventCode = form.eventCode;

  let categoryInformation;
  find(
    INTERNAL_CATEGORY_MAP,
    entries =>
      (categoryInformation = find(entries, { eventCode: selectedEventCode })),
  );

  const optionsForCategory = getOptionsForCategory(
    caseDetail,
    categoryInformation,
  );

  if (optionsForCategory.showSecondaryDocumentSelect) {
    optionsForCategory.showSecondaryDocumentSelect = false;
    optionsForCategory.showSecondaryDocumentForm = true;
  }

  return {
    certificateOfServiceDateFormatted,
    internalDocumentTypes,
    partyValidationError,
    previouslyFiledWizardDocuments,
    primary: optionsForCategory,
    showObjection: objectionDocumentTypes.includes(form.documentType),
    showPrimaryDocumentValid: !!form.primaryDocumentFile,
    showRespondentParty: !!caseDetail.respondent,
    showSecondaryDocumentValid: !!form.secondaryDocumentFile,
    showSecondaryParty,
    showSecondarySupportingDocumentValid: !!form.secondarySupportingDocumentFile,
    showSupportingDocumentValid: !!form.supportingDocumentFile,
    supportingDocumentTypeList,
  };
};
