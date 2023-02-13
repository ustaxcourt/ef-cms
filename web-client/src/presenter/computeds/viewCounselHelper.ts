import { state } from 'cerebral';

export const viewCounselHelper = get => {
  const caseDetail = get(state.caseDetail);
  const privatePractitioner = get(state.modal.contact);

  const representingNames = privatePractitioner.representing.map(
    representingId =>
      caseDetail.petitioners.find(p => p.contactId === representingId).name,
  );

  return {
    representingNames,
  };
};
