import { state } from '@web-client/presenter/app.cerebral';

/**
 * initialize consolidated case state values for ConfirmInitiateServiceModal
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get object
 * @param {object} providers.store the cerebral store object
 */
export const setMultiDocketingCheckboxesAction = ({
  get,
  props,
  store,
}: ActionProps) => {
  const consolidatedCases =
    props.consolidatedCases || get(state.caseDetail.consolidatedCases);

  const consolidatedCasesWithCheckboxInfo = consolidatedCases.map(aCase => ({
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
