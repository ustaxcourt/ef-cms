import { ROLE_PERMISSIONS, isAuthorized } from './authorizationClientService';

export const getUserPermissions = user => {
  if (user) {
    const permissions = {};
    Object.keys(ROLE_PERMISSIONS).forEach(key => {
      permissions[key] = isAuthorized(user, ROLE_PERMISSIONS[key]);
    });
    return permissions;
  }
};
