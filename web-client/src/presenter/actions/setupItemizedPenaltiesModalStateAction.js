import { partition } from 'lodash';
import { state } from 'cerebral';

/**
 * Setting up itemized penalties on state
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.props props passed through via cerebral
 * @param {object} providers.store the cerebral store object
 */
export const setupItemizedPenaltiesModalStateAction = ({
  applicationContext,
  props,
  store,
}) => {
  const { penalties } = props;

  const partitionedPenalties = partition(penalties, [
    'penaltyType',
    applicationContext.getConstants().PENALTY_TYPES.IRS_PENALTY_AMOUNT,
  ]);

  const irsAmountPenalties = partitionedPenalties[0];
  const courtDeterminationAmounts = partitionedPenalties[1];

  const itemizedPenalties = irsAmountPenalties.map(
    (irsAmountPenalty, index) => {
      let combinedPenalty = {
        irsPenaltyAmount: irsAmountPenalty.penaltyAmount,
      };
      console.log(
        'courtDeterminationAmounts[index]',
        courtDeterminationAmounts[index],
      );
      if (courtDeterminationAmounts[index]) {
        combinedPenalty.courtDeterminationAmount =
          courtDeterminationAmounts[index].penaltyAmount;
      }
      return combinedPenalty;
    },
  );

  store.set(state.modal.itemizedPenalties, itemizedPenalties);
};
