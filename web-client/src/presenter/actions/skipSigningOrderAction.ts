import { CaseWithSelectionInfo } from '@shared/business/utilities/getSelectedConsolidatedCasesToMultiDocketOn';
import { state } from '@web-client/presenter/app.cerebral';

/**
 * redirects to the draft documents page
 * @param {object} providers the providers object
 * @param {Function} providers.get the cerebral get function
 * @param {object} providers.store the cerebral store
 * @returns {object} object with a path
 */
export const skipSigningOrderAction = ({
  applicationContext,
  get,
  store,
}: ActionProps) => {
  const isCreatingOrder = get(state.isCreatingOrder);
  if (isCreatingOrder) {
    store.unset(state.isCreatingOrder);
    return {
      alertSuccess: {
        message:
          'Your document has been successfully created and attached to this message',
      },
    };
  }

  const { docketEntries, docketNumber } = get(state.caseDetail);
  const docketEntryId = get(state.docketEntryId);
  const order = docketEntries.find(d => d.docketEntryId === docketEntryId);

  const consolidatedCasesToMultiDocketOn = get(
    state.modal.form.consolidatedCasesToMultiDocketOn,
  );

  const consolidatedCasesToMultiDocketOnMetaData: CaseWithSelectionInfo[] = (
    consolidatedCasesToMultiDocketOn || []
  ).map(caseInfo => ({
    checked: caseInfo.checked,
    docketNumberWithSuffix: caseInfo.docketNumberWithSuffix,
  }));

  const addedDocketNumbers = applicationContext
    .getUtilities()
    .getSelectedConsolidatedCasesToMultiDocketOn(
      consolidatedCasesToMultiDocketOnMetaData,
    );

  return {
    alertSuccess: {
      message: `${order.documentTitle || order.documentType} updated.`,
      metaData: addedDocketNumbers.join(', '),
    },
    path: `/case-detail/${docketNumber}/draft-documents`,
  };
};
