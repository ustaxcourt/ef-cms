import { state } from 'cerebral';

/**
 * Calculates penalties from the current calculate penalties modal
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get function to retrieve state values
 * @returns {number} total computed value from penalty values
 */
export const calculatePenaltiesAction = ({ get }) => {
  let {
    penalties,
    statisticIndex,
    subkey: penaltyAmountType,
  } = get(state.modal);

  let initialPenalties = statisticIndex
    ? get(state.form.statistics[statisticIndex].penalties) || []
    : get(state.form.penalties) || [];

  const filteredInitialPenalties = initialPenalties.filter(penalty => {
    return penalty.penaltyType !== penaltyAmountType;
  });

  penalties.forEach(penalty => {
    penalty.penaltyType = penaltyAmountType;
  });

  penalties = penalties.filter(penalty => penalty.name);

  const parseCurrency = value => Number(value).toFixed(2);

  const penaltyAggregator = (sum, penalty) =>
    Number(sum) + Number(penalty.penaltyAmount);

  const total = parseCurrency(penalties.reduce(penaltyAggregator, 0));

  penalties = [...penalties, ...filteredInitialPenalties];

  return {
    penalties,
    totalPenalties: total,
  };
};
