import { state } from '@web-client/presenter/app.cerebral';

export const unsetDocumentSelectedForPreviewAction = ({
  store,
}: ActionProps) => {
  store.unset(state.currentViewMetadata.documentSelectedForPreview);
};
