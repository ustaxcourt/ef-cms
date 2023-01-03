import { state } from 'cerebral';

/**
 * sets penalties array to a set of empty string elements
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store object
 * @returns {void}
 */
export const setDefaultPenaltiesAction = ({ get, store }) => {
  const defaultPenaltiesArrayState = [
    { irsPenaltyAmount: '0' },
    { irsPenaltyAmount: '0' },
    { irsPenaltyAmount: '0' },
    { irsPenaltyAmount: '0' },
    { irsPenaltyAmount: '0' },
  ];
  let penalties = get(state.form.penalties);
  penalties.forEach((penalty, index) => {
    if (index > 9) return;
    if (index > 4) {
      defaultPenaltiesArrayState.push({
        irsPenaltyAmount: `${penalty.irsPenaltyAmount}`,
        name: `Penalty ${index + 1} (IRS)`,
        penaltyId: penalty.penaltyId,
      });
    } else {
      defaultPenaltiesArrayState[index] = {
        irsPenaltyAmount: `${penalty.irsPenaltyAmount}`,
        name: `Penalty ${index + 1} (IRS)`,
        penaltyId: penalty.penaltyId,
      };
    }
  });
  store.set(state.modal.penalties, defaultPenaltiesArrayState);
};
