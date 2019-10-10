import { state } from 'cerebral';

export const primaryContactEditHelper = get => {
  const caseDetail = get(state.caseDetail);
  const { PARTY_TYPES } = get(state.constants);

  return {
    showInCareOf:
      caseDetail.partyType === PARTY_TYPES.estateWithoutExecutor ||
      caseDetail.partyType === PARTY_TYPES.corporation,
  };
};
