import { state } from '@web-client/presenter/app.cerebral';
/**
 * gets the flag to indicate whether or not to use the same address as the primary contact
 * @param {object} providers the providers object
 * @param {object} providers.path the cerebral path object used for invoking the next path in the sequence based on the section value
 * @param {object} providers.get the cerebral get function to retrieve state values
 * @returns {object} the path to call based on the section value
 */
export const getShouldCopyPrimaryToSecondaryAddressAction = ({
  get,
  path,
}: ActionProps) => {
  const shouldCopy = get(state.form.useSameAsPrimary);

  if (shouldCopy) {
    return path.yes();
  }

  return path.no();
};
