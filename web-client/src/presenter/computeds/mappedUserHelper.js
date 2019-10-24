import { mapValueHelper } from './mapValueHelper';
import { state } from 'cerebral';

export const mappedUserHelper = get => {
  const mappedUser = mapValueHelper(get(state.user) || {});
  return mappedUser;
};
