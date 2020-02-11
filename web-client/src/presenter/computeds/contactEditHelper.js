import { state } from 'cerebral';

export const contactEditHelper = (get, applicationContext) => {
  const caseDetail = get(state.caseDetail);
  const { PARTY_TYPES } = applicationContext.getConstants();

  let contactPrimary, contactSecondary;
  switch (caseDetail.partyType) {
    case PARTY_TYPES.estateWithoutExecutor:
    case PARTY_TYPES.corporation:
      contactPrimary = {
        showInCareOf: true,
      };
      break;
    case PARTY_TYPES.petitionerDeceasedSpouse:
      contactSecondary = {
        showInCareOf: true,
      };
      break;
  }

  return {
    contactPrimary,
    contactSecondary,
  };
};
