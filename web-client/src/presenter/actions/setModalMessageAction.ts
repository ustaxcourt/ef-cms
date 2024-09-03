import { state } from '@web-client/presenter/app.cerebral';

export const setModalMessageAction = ({ props, store }: ActionProps) => {
  store.set(state.modal.message, props.message);
};
