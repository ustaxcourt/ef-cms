import { state } from 'cerebral';

/**
 * Sets formatted penalty amounts to state.form
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get function to retrieve state values
 * @param {object} providers.store the cerebral store object
 * @returns {void}
 */
export const formatAndSetPenaltiesAction = ({ get, store }) => {
  const { penalties } = get(state.modal);

  const parseCurrency = value => Number(value).toFixed(2);

  penalties.map(penalty => {
    return {
      ...penalty,
      irsPenaltyAmount: parseCurrency(penalty.irsPenaltyAmount),
    };
  });

  store.set(state.form.penalties, penalties);
};
