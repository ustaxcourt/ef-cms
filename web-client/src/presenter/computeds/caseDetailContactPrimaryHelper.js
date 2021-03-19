import { state } from 'cerebral';

export const caseDetailContactPrimaryHelper = (get, applicationContext) => {
  const caseDetail = get(state.caseDetail);

  const contactPrimary = applicationContext
    .getUtilities()
    .getContactPrimary(caseDetail);

  return { contactPrimary };
};
