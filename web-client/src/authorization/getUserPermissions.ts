import { ROLE_PERMISSIONS, isAuthorized } from '@shared/authorization/authorizationClientService';
import { RawIrsPractitioner } from '@shared/business/entities/IrsPractitioner';
import { RawPractitioner } from '@shared/business/entities/Practitioner';
import { RawUser } from '@shared/business/entities/User';

export const getUserPermissions = (
  user?: RawUser | RawPractitioner | RawIrsPractitioner,
) => {
  if (user) {
    const permissions = {};
    Object.keys(ROLE_PERMISSIONS).forEach(key => {
      permissions[key] = isAuthorized(user, ROLE_PERMISSIONS[key]);
    });
    return permissions;
  }
};
