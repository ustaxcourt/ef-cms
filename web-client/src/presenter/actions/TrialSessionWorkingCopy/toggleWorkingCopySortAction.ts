import { state } from '@web-client/presenter/app.cerebral';

export const toggleWorkingCopySortAction = ({
  get,
  props,
  store,
}: ActionProps<{ sortField: string }>) => {
  const { sortField } = props;
  const fromSort = get(state.trialSessionWorkingCopy.sort);
  const fromSortOrder = get(state.trialSessionWorkingCopy.sortOrder);

  let newSortOrder = 'asc';

  if (sortField === fromSort) {
    newSortOrder = (fromSortOrder === 'desc' && 'asc') || 'desc';
  }

  store.set(state.trialSessionWorkingCopy.sort, sortField);
  store.set(state.trialSessionWorkingCopy.sortOrder, newSortOrder);
};
