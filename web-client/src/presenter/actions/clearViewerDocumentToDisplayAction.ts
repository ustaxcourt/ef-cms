import { state } from '@web-client/presenter/app.cerebral';

export const clearViewerDocumentToDisplayAction = ({ store }: ActionProps) => {
  store.unset(state.viewerDocumentToDisplay);
  store.unset(state.iframeSrc);
};
