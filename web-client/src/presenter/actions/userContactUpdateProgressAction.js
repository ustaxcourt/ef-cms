import { state } from 'cerebral';

/**
 * set the user contact update progress state
 *
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.store the cerebral store
 */
export const userContactUpdateProgressAction = ({ props, store }) => {
  const { completedCases, totalCases } = props;

  store.set(state.userContactEditProgress.inProgress, true);
  store.set(state.userContactEditProgress.totalCases, totalCases);
  store.set(state.userContactEditProgress.completedCases, completedCases);
};
