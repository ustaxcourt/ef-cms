import { state } from 'cerebral';

/**
 * initialize consolidated case state values for ConfirmInitiateServiceModal
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get object
 * @param {object} providers.store the cerebral store object
 */
export const setMultiDocketingCheckboxesAction = ({ props, store }) => {
  const { consolidatedCases } = props;

  const consolidatedCasesWithCheckboxInfo = consolidatedCases.map(
    consolidatedCase => {
      return {
        ...consolidatedCase,
        checkboxDisabled: true,
        checked: true,
        formattedPetitioners: consolidatedCase.petitioners
          .map(ptr => ptr.name)
          .join(' & '),
        tooltip: '',
      };
    },
  );

  store.set(state.modal.form.consolidatedCaseAllCheckbox, true);
  store.set(
    state.modal.form.consolidatedCasesToMultiDocketOn,
    consolidatedCasesWithCheckboxInfo,
  );
};
