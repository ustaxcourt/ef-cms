import { MAX_NUMBER_DEFICIENCY_STATISTIC_PENALTIES } from '@shared/business/entities/EntityConstants';
import { state } from '@web-client/presenter/app.cerebral';

/**
 * adds a penalty input to the modal penalties array
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get function
 * @param {object} providers.store the cerebral store object
 * @returns {void}
 */
export const addPenaltyInputAction = ({ get, store }: ActionProps) => {
  const { penalties, penaltyNameLabel, subkey: penaltyType } = get(state.modal);
  if (penalties.length < MAX_NUMBER_DEFICIENCY_STATISTIC_PENALTIES) {
    penalties.push({
      name: `Penalty ${penalties.length + 1} ${penaltyNameLabel}`,
      penaltyAmount: '',
      penaltyType,
    });

    store.set(state.modal.penalties, penalties);
  }
};
