import { Get } from 'cerebral';
import { User } from '@shared/business/entities/User';
import { state } from '@web-client/presenter/app.cerebral';

export const showSortableHeaders = (get: Get): any => {
  const { role } = get(state.user);
  return User.isInternalUser(role);
};
