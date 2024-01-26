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

  const allCasesSelected =
    (consolidatedCases?.length || 0) ===
    (createOrderAddedDocketNumbers?.length || 0);

  const consolidatedCasesWithCheckboxInfo: ConsolidatedCasesWithCheckboxInfoType[] =
    consolidatedCases.map(aCase => ({
      checkboxDisabled: allCasesSelected
        ? true
        : !createOrderAddedDocketNumbers,
      checked:
        createOrderAddedDocketNumbers && !allCasesSelected
          ? createOrderAddedDocketNumbers.includes(aCase.docketNumberWithSuffix)
          : true,
      docketNumber: aCase.docketNumber,
      docketNumberWithSuffix: aCase.docketNumberWithSuffix,
      formattedPetitioners: aCase.petitioners.map(ptr => ptr.name).join(' & '),
      leadDocketNumber: aCase.leadDocketNumber,
    }));

  store.set(
    state.modal.form.consolidatedCaseAllCheckbox,
    allCasesSelected ? true : !createOrderAddedDocketNumbers,
  );

  store.set(
    state.modal.form.consolidatedCasesToMultiDocketOn,
    consolidatedCasesWithCheckboxInfo,
  );
};
