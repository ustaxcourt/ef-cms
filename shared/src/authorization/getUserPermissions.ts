import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { ROLE_PERMISSIONS, isAuthorized } from './authorizationClientService';

/**
 * Returns permissions based on the given user
 *
 * @param {object} user the user to check for authorization
 * @returns {object|void} ROLE_PERMISSIONS keys with boolean value based on user role
 */
export const getUserPermissions = (user?: UnknownAuthUser) => {
  if (user) {
    const permissions = {};
    Object.keys(ROLE_PERMISSIONS).forEach(key => {
      permissions[key] = isAuthorized(user, ROLE_PERMISSIONS[key]);
    });
    return permissions;
  }
};
