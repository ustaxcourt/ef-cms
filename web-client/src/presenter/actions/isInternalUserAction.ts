import { state } from '@web-client/presenter/app.cerebral';

/**
 * takes a path depending on if the user an internal user
 * @param {object} providers the providers object
 * @param {object} providers.path the cerebral path object
 * @returns {object} path function to call
 */
export const isInternalUserAction = ({
  applicationContext,
  get,
  path,
}: ActionProps) => {
  const user = get(state.user);
  return applicationContext.getUtilities().isInternalUser(user.role)
    ? path.yes()
    : path.no();
};
