import { state } from '@web-client/presenter/app.cerebral';

export const unsetCreateOrderAddedDocketNumbers = ({ store }: ActionProps) => {
  store.unset(state.createOrderAddedDocketNumbers);
};
