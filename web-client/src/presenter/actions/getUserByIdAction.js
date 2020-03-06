/**
 * gets the user by the userId in props
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context used for getting the getUser use case
 * @param {object} providers.props the cerebral props object used for getting the props.user
 * @returns {object} the user
 */
export const getUserByIdAction = async ({ applicationContext, props }) => {
  const user = await applicationContext
    .getUseCases()
    .getUserByIdInteractor({ applicationContext, userId: props.userId });
  return { user };
};
