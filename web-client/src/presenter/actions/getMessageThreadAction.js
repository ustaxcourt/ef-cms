/**
 * Fetches the messages using the getMessage use case using the props.parentMessageId
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext needed for getting the getCase use case
 * @param {object} providers.props the cerebral props object containing props.docketNumber
 * @returns {object} contains the message returned from the use case
 */
export const getMessageThreadAction = async ({ applicationContext, props }) => {
  const { parentMessageId } = props;
  const messageDetail = await applicationContext
    .getUseCases()
    .getMessageThreadInteractor(applicationContext, {
      parentMessageId,
    });
  return { messageDetail };
};
