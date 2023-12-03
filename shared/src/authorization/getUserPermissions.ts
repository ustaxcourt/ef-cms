import { ROLE_PERMISSIONS, isAuthorized } from './authorizationClientService';
import { RawIrsPractitioner } from '@shared/business/entities/IrsPractitioner';
import { RawUser } from '@shared/business/entities/User';

/**
 * Returns permissions based on the given user
 *
 * @param {object} user the user to check for authorization
 * @returns {object|void} ROLE_PERMISSIONS keys with boolean value based on user role
 */
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
