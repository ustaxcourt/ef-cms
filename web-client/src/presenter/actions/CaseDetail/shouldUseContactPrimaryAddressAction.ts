import { state } from '@web-client/presenter/app.cerebral';

/**
 * returns yes path if useSameAsPrimary is true, no otherwise
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get function
 * @param {object} providers.path the cerebral path which is contains the next paths that can be invoked
 * @returns {object} continue path for the sequence
 */
export const shouldUseContactPrimaryAddressAction = ({
  get,
  path,
}: ActionProps) => {
  const useSameAsPrimary = get(state.form.useSameAsPrimary);

  if (useSameAsPrimary) {
    return path.yes();
  } else {
    return path.no();
  }
};
