import { state } from '@web-client/presenter/app.cerebral';

/**
 * sets userPendingEmail on state.screenMetadata
 * sets allPendingEmails on state.screenMetadata
 * @param {object} props.applicationContext the applicationContext
 * @param {function} props.get the cerebral get function
 */
export const setUserPendingEmailAction = ({ props, store }: ActionProps) => {
  const { userPendingEmail, allPendingEmails } = props;
  store.set(state.screenMetadata.userPendingEmail, userPendingEmail);
  store.set(state.screenMetadata.allPendingEmails, allPendingEmails);
};
