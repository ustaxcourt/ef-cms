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

  let initialPenalties =
    get(state.form.statistics[statisticIndex].penalties) || [];

  initialPenalties = initialPenalties.filter(penalty => {
    penalty.penaltyType !== penaltyAmountType;
  });

  penalties.forEach(penalty => {
    penalty.penaltyType = penaltyAmountType;
  });

  penalties = penalties.filter(penalty => penalty.name);

  penalties = [...penalties, ...initialPenalties];

  const parseCurrency = value => Number(value).toFixed(2);

  const penaltyAggregator = (sum, penalty) =>
    Number(sum) + Number(penalty.penaltyAmount);

  const total = parseCurrency(penalties.reduce(penaltyAggregator, 0));

  return {
    penalties,
    totalPenalties: total,
  };
};
