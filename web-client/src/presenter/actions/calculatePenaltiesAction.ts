import { state } from '@web-client/presenter/app.cerebral';

/**
 * Calculates penalties from the current calculate penalties modal
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get function to retrieve state values
 * @returns {number} total computed value from penalty values
 */
export const calculatePenaltiesAction = ({ get }: ActionProps) => {
  let {
    penalties: currentPenalties,
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

  currentPenalties.forEach(penalty => {
    penalty.penaltyType = modalPenaltyType;
    penalty.statisticId = statisticId;
  });

  currentPenalties = currentPenalties.filter(
    penalty => penalty.penaltyAmount !== '',
  );

  const parseCurrency = value => Number(value).toFixed(2);

  const penaltyAggregator = (sum, penalty) =>
    Number(sum) + Number(penalty.penaltyAmount);

  const sumOfPenalties = currentPenalties.length
    ? parseCurrency(currentPenalties.reduce(penaltyAggregator, 0))
    : undefined;

  const allPenalties = [...currentPenalties, ...excludedInitialPenalties];

  return {
    allPenalties,
    itemizedPenaltiesOfCurrentType: currentPenalties,
    sumOfPenalties,
  };
};
