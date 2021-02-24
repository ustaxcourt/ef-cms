import { state } from 'cerebral';

/**
 * sets userPendingEmail on state.screenMetadata
 *
 * @param {object} props.applicationContext the applicationContext
 * @param {function} props.get the cerebral get function
 */
export const setUserPendingEmailAction = async ({ props, store }) => {
  const { userPendingEmail } = props;
  store.set(state.screenMetadata.userPendingEmail, userPendingEmail);
};
