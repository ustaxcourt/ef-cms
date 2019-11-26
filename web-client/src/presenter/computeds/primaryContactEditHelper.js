import { state } from 'cerebral';

export const primaryContactEditHelper = (get, applicationContext) => {
  const caseDetail = get(state.caseDetail);
  const { PARTY_TYPES } = applicationContext.getConstants();

  return {
    showInCareOf:
      caseDetail.partyType === PARTY_TYPES.estateWithoutExecutor ||
      caseDetail.partyType === PARTY_TYPES.corporation,
  };
};
