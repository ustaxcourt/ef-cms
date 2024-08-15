import { state } from '@web-client/presenter/app.cerebral';

import { Get } from '../../utilities/cerebralWrapper';
export const printPaperServiceHelper = (get: Get): any => {
  const caseDetail = get(state.caseDetail);
  const docketEntryId = get(state.docketEntryId);
  if (docketEntryId) {
    const doc = caseDetail.docketEntries.find(
      d => d.docketEntryId === docketEntryId,
    );
    return { documentTitle: doc.documentTitle };
  } else {
    return {};
  }
};
