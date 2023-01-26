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
  const { determinationTotalPenalties, irsTotalPenalties, penalties } = props;

  let itemizedPenalties = [];
  let combinedPenalty = {};

  const formatDollars = preFormattedDollars => {
    return applicationContext.getUtilities().formatDollars(preFormattedDollars);
  };

  const formattedDeterminationTotalPenalties = determinationTotalPenalties
    ? formatDollars(determinationTotalPenalties)
    : '';

  const partitionedPenalties = partition(penalties, [
    'penaltyType',
    applicationContext.getConstants().PENALTY_TYPES.IRS_PENALTY_AMOUNT,
  ]);

  const irsAmountPenalties = partitionedPenalties[0];
  const courtDeterminationAmounts = partitionedPenalties[1];

  if (irsAmountPenalties.length >= courtDeterminationAmounts.length) {
    itemizedPenalties = irsAmountPenalties.map((irsAmountPenalty, index) => {
      combinedPenalty = {
        irsPenaltyAmount: formatDollars(irsAmountPenalty.penaltyAmount),
      };
      if (courtDeterminationAmounts[index]) {
        combinedPenalty.courtDeterminationAmount = formatDollars(
          courtDeterminationAmounts[index].penaltyAmount,
        );
      }
      return combinedPenalty;
    });
  } else {
    itemizedPenalties = courtDeterminationAmounts.map(
      (courtDeterminationAmount, index) => {
        combinedPenalty = {
          courtDeterminationAmount: formatDollars(
            courtDeterminationAmount.penaltyAmount,
          ),
        };
        if (irsAmountPenalties[index]) {
          combinedPenalty.irsPenaltyAmount = formatDollars(
            irsAmountPenalties[index].penaltyAmount,
          );
        }
        return combinedPenalty;
      },
    );
  }

  store.set(state.modal, {
    determinationTotalPenalties: formattedDeterminationTotalPenalties,
    irsTotalPenalties: formatDollars(irsTotalPenalties),
    itemizedPenalties,
  });
};
