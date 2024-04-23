import { state } from '@web-client/presenter/app.cerebral';

export const clearDocumentsSelectedForDownload = ({ store }: ActionProps) => {
  store.set(state.documentsSelectedForDownload, []);
};
