import { RawUser } from '@shared/business/entities/User';
import { state } from '@web-client/presenter/app.cerebral';

export const setIrsPractitionerUsersAction = ({
  props,
  store,
}: ActionProps<{ irsPractitioners: RawUser[] }>) => {
  const { irsPractitioners } = props;
  store.set(state.irsPractitioners, irsPractitioners);
};
