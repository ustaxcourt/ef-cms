import { state } from '@web-client/presenter/app.cerebral';
import { isLeadCase } from '@shared/business/entities/cases/Case';

export const updateCaseCheckboxAction = ({
  get,
  props,
  store,
}: ActionProps) => {
  let consolidatedCases = get(
    state.modal.form.consolidatedCasesToMultiDocketOn,
  );

  consolidatedCases = consolidatedCases.map(consolidatedCase => {
    if (
      consolidatedCase.docketNumber === props.docketNumber &&
      !isLeadCase({
        docketNumber: props.docketNumber,
        leadDocketNumber: consolidatedCase.leadDocketNumber,
      })
    ) {
      return {
        ...consolidatedCase,
        checked: !consolidatedCase.checked,
      };
    }

    return consolidatedCase;
  });

  if (consolidatedCases.every(obj => obj.checked)) {
    store.set(state.modal.form.consolidatedCaseAllCheckbox, true);
  } else {
    store.set(state.modal.form.consolidatedCaseAllCheckbox, false);
  }

  store.set(
    state.modal.form.consolidatedCasesToMultiDocketOn,
    consolidatedCases,
  );
};
