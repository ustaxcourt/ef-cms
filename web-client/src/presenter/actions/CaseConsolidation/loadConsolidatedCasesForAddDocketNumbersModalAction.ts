import { state } from '@web-client/presenter/app.cerebral';

/**
 * initialize consolidated case state values for ConfirmInitiateServiceModal
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get object
 * @param {object} providers.store the cerebral store object
 */
export const loadConsolidatedCasesForAddDocketNumbersModalAction = ({
  get,
  store,
}: ActionProps) => {
  let addedDocketNumbers = get(state.addedDocketNumbers);
  let consolidatedCases = get(state.caseDetail.consolidatedCases);
  let caseDetail = get(state.caseDetail);

  consolidatedCases.forEach(consolidatedCase => {
    const isChecked = !!addedDocketNumbers.includes(
      consolidatedCase.docketNumber,
    );

    Object.assign(consolidatedCase, {
      checkboxDisabled: false,
      checked: isChecked,
      formattedPetitioners: consolidatedCase.petitioners
        .map(ptr => ptr.name)
        .join(' & '),
      tooltip: '',
    });
  });

  const allChecked = consolidatedCases.every(({ checked }) => checked);
  store.set(state.consolidatedCaseAllCheckbox, allChecked);

  consolidatedCases.forEach(consolidatedCase => {
    const isLeadCase =
      consolidatedCase.docketNumber === caseDetail.leadDocketNumber;
    let disableCheckbox = allChecked;
    if (isLeadCase) {
      disableCheckbox = true;
    }
    Object.assign(consolidatedCase, {
      checkboxDisabled: disableCheckbox,
    });
  });
};
