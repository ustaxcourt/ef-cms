import { state } from 'cerebral';

/**
 * sets pendingEmails on state.screenMetadata
 *
 * @param {object} props.applicationContext the applicationContext
 * @param {function} props.get the cerebral get function
 */
export const setPendingEmailsOnCaseAction = async ({ props, store }) => {
  const { pendingEmails } = props;
  store.set(state.screenMetadata.pendingEmails, pendingEmails);
};
