import { state } from '@web-client/presenter/app.cerebral';

/**
 * sets state.contactToSeal based on the value of props.contactToSeal
 *
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.store the cerebral store
 */
export const setContactInformationForModalAction = ({
  path,
  props,
  store,
}: ActionProps) => {
  const { contactToSeal } = props;
  if (!contactToSeal) {
    throw new Error('contactToSeal is required');
  }
  store.set(state.contactToSeal, contactToSeal);
  return contactToSeal.isAddressSealed ? path.unseal() : path.seal();
};
