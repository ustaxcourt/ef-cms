/**
 * gets the user based on the name provided.
 *
 * @param {Object} providers the providers object
 * @param {Object} providers.applicationContext the application context used for getting the getUser use case
 * @param {Function} providers.props the cerebral props object used for getting the props.user
 * @returns {Object} the user
 */
export default async ({ applicationContext, props }) => {
  const user = await applicationContext.getUseCases().getUser(props.user);
  return { user };
};
