/**
 * Fetches the message using the getMessage use case using the props.messageId
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext needed for getting the getCase use case
 * @param {object} providers.props the cerebral props object containing props.docketNumber
 * @returns {object} contains the message returned from the use case
 */
export const getMessageAction = async ({ applicationContext, props }) => {
  const { messageId } = props;
  const messageDetail = await applicationContext
    .getUseCases()
    .getCaseMessageInteractor({
      applicationContext,
      messageId,
    });
  return { messageDetail };
};
