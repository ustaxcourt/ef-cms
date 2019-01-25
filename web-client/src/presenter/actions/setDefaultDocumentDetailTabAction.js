import { state } from 'cerebral';

export default ({ store, get }) => {
  const { isEditablePetition } = get(state.documentDetailHelper);
  store.set(
    state.currentTab,
    isEditablePetition ? 'Document Info' : 'Pending Messages',
  );
};
