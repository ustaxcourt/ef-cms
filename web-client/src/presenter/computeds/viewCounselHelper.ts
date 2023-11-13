import { state } from '@web-client/presenter/app.cerebral';

import { Get } from 'cerebral';
export const viewCounselHelper = (get: Get): any => {
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
