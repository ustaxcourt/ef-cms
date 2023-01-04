import { state } from 'cerebral';

/**
 * sets penalties array to a set of empty string elements
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store object
 * @returns {void}
 */
export const setDefaultPenaltiesAction = ({ get, store }) => {
  // TODO: refactor this function some
  const penalties = get(state.form.penalties);
  let initialPenalties = penalties ?? [];

  if (initialPenalties.length < 5) {
    const missingPenalties = 5 - initialPenalties.length;
    for (let i = 0; i < missingPenalties; i++) {
      initialPenalties.push({
        determinationPenaltyAmount: '0',
        irsPenaltyAmount: '0',
      });
    }
  }
  store.set(state.modal.penalties, initialPenalties);
};
