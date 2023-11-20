import { state } from '@web-client/presenter/app.cerebral';

export const setRedirectUrlAction = ({ props, store }: ActionProps) => {
  store.set(state.redirectUrl, props.redirectUrl);
};
