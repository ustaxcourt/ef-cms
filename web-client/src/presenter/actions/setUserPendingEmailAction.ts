import { state } from '@web-client/presenter/app.cerebral';

/**
 * sets userPendingEmail on state.screenMetadata
 * @param {object} props.applicationContext the applicationContext
 * @param {function} props.get the cerebral get function
 */
export const setUserPendingEmailAction = ({ props, store }: ActionProps) => {
  const { userPendingEmail } = props;
  store.set(state.screenMetadata.userPendingEmail, userPendingEmail);
};
