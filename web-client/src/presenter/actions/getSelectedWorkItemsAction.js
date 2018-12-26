import { state } from 'cerebral';

export default async ({ get }) => {
  return get(state.selectedWorkItems);
};
