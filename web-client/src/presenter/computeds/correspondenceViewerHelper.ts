import { state } from '@web-client/presenter/app.cerebral';

import { Get } from '../../utilities/cerebralWrapper';
export const correspondenceViewerHelper = (get: Get): any => {
  const permissions = get(state.permissions);
  const docketNumber = get(state.caseDetail.docketNumber);
  const correspondenceId = get(
    state.viewerCorrespondenceToDisplay.correspondenceId,
  );

  return {
    editCorrespondenceLink: `/case-detail/${docketNumber}/edit-correspondence/${correspondenceId}`,
    showDeleteCorrespondenceButton: permissions.CASE_CORRESPONDENCE,
    showEditCorrespondenceButton: permissions.CASE_CORRESPONDENCE,
  };
};
