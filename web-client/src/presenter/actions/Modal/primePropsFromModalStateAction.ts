import { state } from '@web-client/presenter/app.cerebral';

/**
 * update props from modal state to pass to other actions
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get function
 * @returns {object} the new props
 */
export const primePropsFromModalStateAction = ({ get }: ActionProps) => {
  const modalState = get(state.modal);

  return { ...modalState };
};
