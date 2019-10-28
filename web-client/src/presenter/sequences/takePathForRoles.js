export const takePathForRoles = (users, actions) =>
  users.reduce((paths, role) => ((paths[role] = actions), paths), {});
