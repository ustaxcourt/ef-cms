import { state } from '@web-client/presenter/app.cerebral';

/**
 * sets penalties array to a set of empty string elements
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store object
 * @returns {void}
 */
export const setDefaultPenaltiesAction = ({
  get,
  props,
  store,
}: ActionProps) => {
  const { statisticId, statisticIndex, subkey: penaltyType } = props;

  const penalties =
    typeof statisticIndex === 'number'
      ? get(state.form.statistics[statisticIndex].penalties)
      : get(state.form.penalties);

  let initialPenalties = penalties ?? [];

  initialPenalties = initialPenalties.filter(
    penalty => penalty.penaltyType === penaltyType,
  );

  const penaltyNameLabel =
    penaltyType === 'irsPenaltyAmount' ? '(IRS)' : '(Court)';

  if (initialPenalties.length < 1) {
    initialPenalties.push({
      name: `Penalty 1 ${penaltyNameLabel}`,
      penaltyAmount: '',
      penaltyType,
    });
  }

  store.set(state.modal.penalties, initialPenalties);
  store.set(state.modal.penaltyNameLabel, penaltyNameLabel);
  store.set(state.modal.statisticId, statisticId);
};
