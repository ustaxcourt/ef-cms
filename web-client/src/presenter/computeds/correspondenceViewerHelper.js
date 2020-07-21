import { state } from 'cerebral';

export const correspondenceViewerHelper = get => {
  const permissions = get(state.permissions);

  return {
    showDeleteCorrespondenceButton: permissions.CASE_CORRESPONDENCE,
    showEditCorrespondenceButton: permissions.CASE_CORRESPONDENCE,
  };
};
