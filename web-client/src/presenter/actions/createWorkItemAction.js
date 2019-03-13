import { state } from 'cerebral';

export const createWorkItemAction = async ({ get }) => {
  // TODO: invoke the createWorkItem interactor / proxy
  const form = get(state.form);
  return {
    form,
  };
};
