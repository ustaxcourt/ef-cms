import { state } from '@web-client/presenter/app.cerebral';

/**
 * sets props.blockedCases on state.blockedCases
 *
 * @param {object} providers the providers object
 * @param {object} providers.props the props object
 * @param {Function} providers.store the cerebral store function
 */
export const setBlockedCasesAction = ({ props, store }: ActionProps) => {
  store.set(state.blockedCases, props.blockedCases);
};
