import { state } from 'cerebral';

export const clearViewerDocumentToDisplayAction = ({ store }: ActionProps) => {
  store.unset(state.viewerDocumentToDisplay);
  store.unset(state.iframeSrc);
};
