import { state } from '@web-client/presenter/app.cerebral';

export const toggleWorkingCopySortAction = ({
  props,
  store,
}: ActionProps<{ sortField: string; sortOrder: 'asc' | 'desc' }>) => {
  store.set(state.trialSessionWorkingCopy.sort, props.sortField);
  store.set(state.trialSessionWorkingCopy.sortOrder, props.sortOrder);
};
