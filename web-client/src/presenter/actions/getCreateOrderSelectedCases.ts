import { state } from '@web-client/presenter/app.cerebral';

export const getCreateOrderSelectedCases = ({ get }: ActionProps) => {
  return { createOrderSelectedCases: get(state.createOrderSelectedCases) };
};
