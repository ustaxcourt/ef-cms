import { state } from 'cerebral';

/**
 * initialize consolidated case state values for ConfirmInitiateServiceModal
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get object
 * @param {object} providers.store the cerebral store object
 */
export const setMultiDocketingCheckboxesAction = ({
  applicationContext,
  get,
  props,
  store,
}) => {
  const consolidatedCases =
    props.consolidatedCases || get(state.caseDetail.consolidatedCases);

  const consolidatedCasesWithCheckboxInfo = consolidatedCases.map(aCase => ({
    checkboxDisabled: true,
    checked: true,
    docketNumber: aCase.docketNumber,
    formattedPetitioners: aCase.petitioners.map(ptr => ptr.name).join(' & '),
    isLeadCase: applicationContext.getUtilities().isLeadCase(aCase),
  }));

  store.set(state.modal.form.consolidatedCaseAllCheckbox, true);
  store.set(
    state.modal.form.consolidatedCasesToMultiDocketOn,
    consolidatedCasesWithCheckboxInfo,
  );
};
