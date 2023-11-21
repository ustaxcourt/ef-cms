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
}>) => {
  const consolidatedCases =
    props.consolidatedCases || get(state.caseDetail.consolidatedCases);

  const consolidatedCasesWithCheckboxInfo: ConsolidatedCasesWithCheckboxInfoType[] =
    consolidatedCases.map(aCase => ({
      checkboxDisabled: true,
      checked: true,
      docketNumber: aCase.docketNumber,
      docketNumberWithSuffix: aCase.docketNumberWithSuffix,
      formattedPetitioners: aCase.petitioners.map(ptr => ptr.name).join(' & '),
      leadDocketNumber: aCase.leadDocketNumber,
    }));

  store.set(state.modal.form.consolidatedCaseAllCheckbox, true);
  store.set(
    state.modal.form.consolidatedCasesToMultiDocketOn,
    consolidatedCasesWithCheckboxInfo,
  );
};
