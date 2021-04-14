import { state } from 'cerebral';

/**
 * sets userPendingEmail on state.screenMetadata
 *
 * @param {object} props.applicationContext the applicationContext
 * @param {function} props.get the cerebral get function
 */
export const setUserPendingEmailForPrimaryAndSecondaryAction = async ({
  props,
  store,
}) => {
  const { contactPrimaryPendingEmail, contactSecondaryPendingEmail } = props;
  store.set(
    state.screenMetadata.contactPrimaryPendingEmail,
    contactPrimaryPendingEmail,
  );
  store.set(
    state.screenMetadata.contactSecondaryPendingEmail,
    contactSecondaryPendingEmail,
  );
};
