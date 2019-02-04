import { state } from 'cerebral';

export default ({ store, get }) => {
  const { showCaseDetailsEdit } = get(state.documentDetailHelper);
  store.set(
    state.currentTab,
    showCaseDetailsEdit ? 'Document Info' : 'Pending Messages',
  );
};
