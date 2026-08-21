import { state } from '@web-client/presenter/app.cerebral';

export const setFormFiledByAsUserAction = ({ get, store }: ActionProps) => {
  const user = get(state.user);
  store.set(state.form.filedBy, user.name);
};
