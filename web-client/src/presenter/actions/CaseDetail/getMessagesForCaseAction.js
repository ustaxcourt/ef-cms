import { state } from 'cerebral';

/**
 * gets and sets the messages for a case
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get helper function
 * @param {object} providers.store the cerebral store object
 */
export const getMessagesForCaseAction = async ({
  applicationContext,
  get,
  store,
}) => {
  const docketNumber = get(state.caseDetail.docketNumber);

  const messages = await applicationContext
    .getUseCases()
    .getMessagesForCaseInteractor(applicationContext, {
      docketNumber,
    });

  store.set(state.caseDetail.messages, messages);
};
