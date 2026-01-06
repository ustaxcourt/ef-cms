import { state } from '@web-client/presenter/app.cerebral';
import { isLeadCase } from '@shared/business/entities/cases/Case';

/**
 * flips the value of checkbox for each case
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get object
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.store the cerebral store object
 */
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
      !isLeadCase({docketNumber: props.docketNumber, leadDocketNumber: consolidatedCase.leadDocketNumber})
    ) {
      return {
        ...consolidatedCase,
        checked: !consolidatedCase.checked,
      };
    }

    return consolidatedCase;
  });

  store.set(
    state.modal.form.consolidatedCasesToMultiDocketOn,
    consolidatedCases,
  );
};
