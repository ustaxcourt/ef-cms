import { state } from '@web-client/presenter/app.cerebral';

/**
 * set the user contact update progress state
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.store the cerebral store
 */
export const userContactUpdateProgressAction = ({
  get,
  props,
  store,
}: ActionProps) => {
  const { completedCases, totalCases } = props;

  const currentCompletedCases =
    get(state.userContactEditProgress.completedCases) ?? 0;

  store.set(state.userContactEditProgress.totalCases, totalCases);
  store.set(
    state.userContactEditProgress.completedCases,
    Math.max(completedCases, currentCompletedCases),
  );
};
