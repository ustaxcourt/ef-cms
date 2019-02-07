import { state } from 'cerebral';

export default ({ store, get }) => {
  const { showDocumentInfoTab } = get(state.documentDetailHelper);
  store.set(
    state.currentTab,
    showDocumentInfoTab ? 'Document Info' : 'Pending Messages',
  );
};
