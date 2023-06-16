import { state } from '@web-client/presenter/app.cerebral';

/**
 * chooses path based on editType
 * @param {object} providers the providers object
 * @param {object} providers.path the cerebral path which contains the next path in the sequence (path of success or error)
 * @returns {object} the next path based on editType
 */
export const chooseMetaTypePathAction = ({ get, path }: ActionProps) => {
  const editType = get(state.screenMetadata.editType);

  if (editType === 'CourtIssued') {
    return path.courtIssued();
  }

  if (editType === 'Document') {
    return path.document();
  }

  return path.noDocument();
};
