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
    subkey: modalPenaltyType,
  } = get(state.modal);

  let initialPenalties = statisticIndex
    ? get(state.form.statistics[statisticIndex].penalties) || []
    : get(state.form.penalties) || [];

  const statisticId = get(state.modal.statisticId);

  const excludedInitialPenalties = initialPenalties.filter(penalty => {
    return penalty.penaltyType !== modalPenaltyType;
  });

  penalties.forEach(penalty => {
    penalty.penaltyType = modalPenaltyType;
    penalty.statisticId = statisticId;
  });

  penalties = penalties.filter(penalty => penalty.penaltyAmount !== '');

  const parseCurrency = value => Number(value).toFixed(2);

  const penaltyAggregator = (sum, penalty) =>
    Number(sum) + Number(penalty.penaltyAmount);

  const sumOfPenalties = penalties.length
    ? parseCurrency(penalties.reduce(penaltyAggregator, 0))
    : undefined;

  const allPenalties = [...penalties, ...excludedInitialPenalties];

  return {
    allPenalties,
    itemizedPenaltiesOfCurrentType: penalties,
    sumOfPenalties,
  };
};
