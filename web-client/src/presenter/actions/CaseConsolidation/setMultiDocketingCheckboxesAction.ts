import { RawConsolidatedCaseSummary } from '@shared/business/dto/cases/ConsolidatedCaseSummary';
import { state } from '@web-client/presenter/app.cerebral';

export type ConsolidatedCasesWithCheckboxInfoType = {
  checkboxDisabled: boolean;
  checked: boolean;
  docketNumber: string;
  docketNumberWithSuffix: string;
  formattedPetitioners: string;
  leadDocketNumber: string;
};

export const setMultiDocketingCheckboxesAction = ({
  get,
  props,
  store,
}: ActionProps<{
  consolidatedCases: RawConsolidatedCaseSummary[];
  createOrderAddedDocketNumbers?: string[];
}>) => {
  const consolidatedCases =
    props.consolidatedCases || get(state.caseDetail.consolidatedCases);

  const createOrderAddedDocketNumbers =
    props.createOrderAddedDocketNumbers ||
    get(state.createOrderAddedDocketNumbers);

  const stateData = getStateConsolidatedCasesAndAllCheckboxBoolean(
    consolidatedCases,
    createOrderAddedDocketNumbers,
  );

  store.set(
    state.modal.form.consolidatedCaseAllCheckbox,
    stateData.consolidatedCaseAllCheckbox,
  );

  store.set(
    state.modal.form.consolidatedCasesToMultiDocketOn,
    stateData.consolidatedCasesToMultiDocketOn,
  );
};

function getStateConsolidatedCasesAndAllCheckboxBoolean(
  consolidatedCases: RawConsolidatedCaseSummary[],
  createOrderAddedDocketNumbers: string[],
): {
  consolidatedCaseAllCheckbox: boolean;
  consolidatedCasesToMultiDocketOn: ConsolidatedCasesWithCheckboxInfoType[];
} {
  if (!createOrderAddedDocketNumbers) {
    const defaultConsolidatedCasesToMultiDocketOn =
      consolidatedCases.map(defaultSettingsMap);

    return {
      consolidatedCaseAllCheckbox: true,
      consolidatedCasesToMultiDocketOn: defaultConsolidatedCasesToMultiDocketOn,
    };
  }

  const allCasesSelected =
    (consolidatedCases?.length || 0) ===
    (createOrderAddedDocketNumbers?.length || 0);

  const consolidatedCasesToMultiDocketOn = consolidatedCases.map(
    calculatedSettingsMap(allCasesSelected, createOrderAddedDocketNumbers),
  );

  return {
    consolidatedCaseAllCheckbox: allCasesSelected
      ? true
      : !createOrderAddedDocketNumbers,
    consolidatedCasesToMultiDocketOn,
  };
}

function defaultSettingsMap(aCase: RawConsolidatedCaseSummary): {
  checkboxDisabled: boolean;
  checked: boolean;
  docketNumber: string;
  docketNumberWithSuffix: string;
  formattedPetitioners: string;
  leadDocketNumber: string;
} {
  return {
    checkboxDisabled: true,
    checked: true,
    docketNumber: aCase.docketNumber,
    docketNumberWithSuffix: aCase.docketNumberWithSuffix,
    formattedPetitioners: aCase.petitioners
      .map(ptr => (ptr as { name: string }).name)
      .join(' & '),
    leadDocketNumber: aCase.leadDocketNumber,
  };
}

function calculatedSettingsMap(
  allCasesSelected: boolean,
  createOrderAddedDocketNumbers: string[],
): (
  value: RawConsolidatedCaseSummary,
  index: number,
  array: RawConsolidatedCaseSummary[],
) => {
  checkboxDisabled: boolean;
  checked: boolean;
  docketNumber: string;
  docketNumberWithSuffix: string;
  formattedPetitioners: string;
  leadDocketNumber: string;
} {
  return aCase => ({
    checkboxDisabled: allCasesSelected ? true : !createOrderAddedDocketNumbers,
    checked:
      createOrderAddedDocketNumbers && !allCasesSelected
        ? createOrderAddedDocketNumbers.includes(aCase.docketNumberWithSuffix)
        : true,
    docketNumber: aCase.docketNumber,
    docketNumberWithSuffix: aCase.docketNumberWithSuffix,
    formattedPetitioners: aCase.petitioners
      .map(ptr => (ptr as { name: string }).name)
      .join(' & '),
    leadDocketNumber: aCase.leadDocketNumber,
  });
}
