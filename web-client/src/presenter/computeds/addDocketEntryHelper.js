import { orderBy } from 'lodash';
import { state } from 'cerebral';
import moment from 'moment';

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
  const { PARTY_TYPES, CATEGORY_MAP, INTERNAL_CATEGORY_MAP } = get(
    state.constants,
  );
  const caseDetail = get(state.caseDetail);
  if (!caseDetail.partyType) {
    return {};
  }
  const form = get(state.form);
  const validationErrors = get(state.validationErrors);
  const showSecondaryParty =
    caseDetail.partyType === PARTY_TYPES.petitionerSpouse ||
    caseDetail.partyType === PARTY_TYPES.petitionerDeceasedSpouse;

  const internalDocumentTypes = getInternalDocumentTypes(INTERNAL_CATEGORY_MAP);

  const supportingDocumentTypeList = CATEGORY_MAP['Supporting Document'].map(
    entry => {
      entry.documentTypeDisplay = entry.documentType.replace(
        /\sin\sSupport$/i,
        '',
      );
      return entry;
    },
  );

  const objectionDocumentTypes = [
    ...CATEGORY_MAP['Motion'].map(entry => {
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

  return {
    certificateOfServiceDateFormatted,
    internalDocumentTypes,
    partyValidationError,
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
