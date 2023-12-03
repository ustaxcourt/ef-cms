import { RawUser } from '@shared/business/entities/User';
import { state } from '@web-client/presenter/app.cerebral';

export const setUsersAction = ({
  props,
  store,
}: ActionProps<{ users: RawUser[] }>) => {
  store.set(state.users, props.users);
};
