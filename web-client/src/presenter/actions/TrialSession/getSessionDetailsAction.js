/**
 * Fetches the details about a session
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext needed for getting the getSessionDetails use case
 * @param {object} providers.props the cerebral props object containing the props.sessionId
 * @returns {object} contains the details of a session
 */
export const getSessionDetailsAction = async ({
  applicationContext,
  props,
}) => {
  const sessionId = props.sessionId;
  const sessionInfo = await applicationContext.getUseCases().getSessionDetails({
    applicationContext,
    sessionId,
  });

  return { sessionInfo };
};
