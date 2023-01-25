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

  const formattedDeterminationTotalPenalties = determinationTotalPenalties
    ? formatDollars(applicationContext, determinationTotalPenalties)
    : '';

  const partitionedPenalties = partition(penalties, [
    'penaltyType',
    applicationContext.getConstants().PENALTY_TYPES.IRS_PENALTY_AMOUNT,
  ]);

  const irsAmountPenalties = partitionedPenalties[0];
  const courtDeterminationAmounts = partitionedPenalties[1];

  let itemizedPenalties;
  if (irsAmountPenalties.length >= courtDeterminationAmounts.length) {
    itemizedPenalties = combinePenaltyAmountsForItemization(
      irsAmountPenalties,
      courtDeterminationAmounts,
      applicationContext,
    );
  } else {
    itemizedPenalties = combinePenaltyAmountsForItemization(
      courtDeterminationAmounts,
      irsAmountPenalties,
      applicationContext,
    );
  }

  store.set(state.modal, {
    determinationTotalPenalties: formattedDeterminationTotalPenalties,
    irsTotalPenalties: formatDollars(applicationContext, irsTotalPenalties),
    itemizedPenalties,
  });
};

const formatDollars = (applicationContext, preFormattedDollars) => {
  return applicationContext.getUtilities().formatDollars(preFormattedDollars);
};

const combinePenaltyAmountsForItemization = (
  primaryPenaltiesArray,
  secondaryPenaltiesArray,
  applicationContext,
) => {
  return primaryPenaltiesArray.map((irsAmountPenalty, index) => {
    let combinedPenalty = {
      irsPenaltyAmount: formatDollars(
        applicationContext,
        irsAmountPenalty.penaltyAmount,
      ),
    };
    if (secondaryPenaltiesArray[index]) {
      combinedPenalty.courtDeterminationAmount = formatDollars(
        applicationContext,
        secondaryPenaltiesArray[index].penaltyAmount,
      );
    }
    return combinedPenalty;
  });
};
