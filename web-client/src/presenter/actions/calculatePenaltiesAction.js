import { state } from 'cerebral';

/**
 * Calculates penalties from the current calculate penalties modal
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get function to retrieve state values
 * @returns {number} total computed value from penalty values
 */
export const calculatePenaltiesAction = ({ get }) => {
  const { penalties } = get(state.modal);

  const parseCurrency = value => `$${Number(value).toFixed(2)}`;

  const penaltyAggregator = (sum, stepValue) => Number(sum) + Number(stepValue);

  const total = parseCurrency(penalties.reduce(penaltyAggregator, 0));

  return {
    totalPenalties: total,
  };
};
