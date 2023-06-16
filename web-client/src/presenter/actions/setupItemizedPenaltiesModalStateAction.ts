import { partition } from 'lodash';
import { state } from '@web-client/presenter/app.cerebral';

/**
 * Setting up itemized penalties on state
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.props props passed through via cerebral
 * @param {object} providers.store the cerebral store object
 */
export const setupItemizedPenaltiesModalStateAction = ({
  applicationContext,
  props,
  store,
}: ActionProps) => {
  const { determinationTotalPenalties, irsTotalPenalties, penalties } = props;
  let itemizedPenalties = [];

  const formattedDeterminationTotalPenalties = determinationTotalPenalties
    ? formatDollars(applicationContext, determinationTotalPenalties)
    : '';

  const partitionedPenalties = partition(penalties, [
    'penaltyType',
    applicationContext.getConstants().PENALTY_TYPES.IRS_PENALTY_AMOUNT,
  ]);

  const irsAmountPenalties = partitionedPenalties[0];
  const courtDeterminationPenalties = partitionedPenalties[1];
  const irsPenaltyType =
    applicationContext.getConstants().PENALTY_TYPES.IRS_PENALTY_AMOUNT;
  const courtDeterminationPenaltyType =
    applicationContext.getConstants().PENALTY_TYPES
      .DETERMINATION_PENALTY_AMOUNT;

  if (irsAmountPenalties.length >= courtDeterminationPenalties.length) {
    itemizedPenalties = combinePenaltyAmountsForItemization(
      applicationContext,
      {
        primaryPenaltiesArray: irsAmountPenalties,
        primaryPenaltyType: irsPenaltyType,
        secondaryPenaltiesArray: courtDeterminationPenalties,
        secondaryPenaltyType: courtDeterminationPenaltyType,
      },
    );
  } else {
    itemizedPenalties = combinePenaltyAmountsForItemization(
      applicationContext,
      {
        primaryPenaltiesArray: courtDeterminationPenalties,
        primaryPenaltyType: courtDeterminationPenaltyType,
        secondaryPenaltiesArray: irsAmountPenalties,
        secondaryPenaltyType: irsPenaltyType,
      },
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
  applicationContext,
  {
    primaryPenaltiesArray,
    primaryPenaltyType,
    secondaryPenaltiesArray,
    secondaryPenaltyType,
  },
) => {
  return primaryPenaltiesArray.map((penalty, index) => {
    return {
      [primaryPenaltyType]: formatDollars(
        applicationContext,
        penalty.penaltyAmount,
      ),
      ...(secondaryPenaltiesArray[index] && {
        [secondaryPenaltyType]: formatDollars(
          applicationContext,
          secondaryPenaltiesArray[index].penaltyAmount,
        ),
      }),
    };
  });
};
