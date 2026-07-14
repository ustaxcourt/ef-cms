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
  store.set(state.contactToSeal, props.contactToSeal);
  if (props.contactToSeal.isAddressSealed) {
    return path.unseal();
  } else {
    return path.seal();
  }
};
