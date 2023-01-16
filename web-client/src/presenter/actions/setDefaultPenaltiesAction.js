import { state } from 'cerebral';

/**
 * sets penalties array to a set of empty string elements
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store object
 * @returns {void}
 */
export const setDefaultPenaltiesAction = ({ get, props, store }) => {
  // TODO: refactor this function some;
  const { statisticIndex, subkey: penaltyType } = props;
  const penalties = get(state.form.statistics[statisticIndex].penalties);

  let initialPenalties = penalties ?? [];

  initialPenalties = initialPenalties.filter(
    penalty => penalty.penaltyType === penaltyType,
  );

  if (initialPenalties.length < 1) {
    initialPenalties.push({
      penaltyAmount: '',
      penaltyType,
    });
  }

  store.set(state.modal.penalties, initialPenalties);
};
