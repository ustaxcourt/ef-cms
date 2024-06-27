import { ClientApplicationContext } from '@web-client/applicationContext';
import { Get } from 'cerebral';
import { state } from '@web-client/presenter/app.cerebral';

export const myAccountHelper = (
  get: Get,
  applicationContext: ClientApplicationContext,
): any => {
  const user = get(state.user);
  const { USER_ROLES } = applicationContext.getConstants();

  const showMyContactInformation =
    user.role === USER_ROLES.privatePractitioner ||
    user.role === USER_ROLES.irsPractitioner;

  const showPetitionerView = user.role === USER_ROLES.petitioner;

  return {
    showMyContactInformation,
    showPetitionerView,
  };
};
