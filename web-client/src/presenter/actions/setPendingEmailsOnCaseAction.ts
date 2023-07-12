import { state } from '@web-client/presenter/app.cerebral';

/**
 * sets pendingEmails on state.screenMetadata
 * @param {object} props.applicationContext the applicationContext
 * @param {function} props.get the cerebral get function
 */
export const setPendingEmailsOnCaseAction = ({ props, store }: ActionProps) => {
  const { pendingEmails } = props;
  store.set(state.screenMetadata.pendingEmails, pendingEmails);
};
