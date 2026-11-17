import { StjEligibilityInputs } from '@shared/business/utilities/calculateStjEligibility';
import { isEqual } from 'lodash';

type PickedStjEligibilityInputs = {
  caseType: string;
  irsAmounts: string[][];
  procedureType?: string;
};

const pickStjEligibilityInputs = ({
  caseType,
  procedureType,
  statistics = [],
}: StjEligibilityInputs): PickedStjEligibilityInputs => ({
  caseType,
  irsAmounts: statistics.map(({ irsDeficiencyAmount, irsTotalPenalties }) => [
    irsDeficiencyAmount,
    irsTotalPenalties,
  ]),
  procedureType,
});

export const shouldRecalculateStjEligibility = (
  previousCase: StjEligibilityInputs,
  updatedCase: StjEligibilityInputs,
): boolean =>
  !isEqual(
    pickStjEligibilityInputs(previousCase),
    pickStjEligibilityInputs(updatedCase),
  );
