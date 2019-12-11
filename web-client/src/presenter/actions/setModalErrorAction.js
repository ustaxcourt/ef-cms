import { state } from 'cerebral';

export const setModalErrorAction = ({ props, store }) => {
  const { error } = props;

  store.set(state.modal.error, error);
};
