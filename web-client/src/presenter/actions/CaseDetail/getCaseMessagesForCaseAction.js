import { state } from 'cerebral';

/**
 * gets and sets the case messages for a case
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get helper function
 * @param {object} providers.store the cerebral store object
 */
export const getCaseMessagesForCaseAction = async ({
  applicationContext,
  get,
  store,
}) => {
  const caseId = get(state.caseDetail.caseId);

  const messages = await applicationContext
    .getUseCases()
    .getCaseMessagesForCaseInteractor({
      applicationContext,
      caseId,
    });

  store.set(state.caseDetail.messages, messages);
};
