import { state } from '@web-client/presenter/app.cerebral';
import { pick } from 'lodash';

/**
 * update state form with docket record entry and document properties
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.props the props passed to this action
 * @param {object} providers.get the cerebral get function
 * @param {object} providers.store the cerebral store
 * @returns {void}
 */
export const setDocketEntryMetaFormForEditAction = ({
  applicationContext,
  get,
  props,
  store,
}: ActionProps) => {
  const { docketEntries } = get(state.caseDetail);
  const { docketRecordIndex } = props;

  const currentDocumentDetail = docketEntries.find(
    ({ index }) => index === docketRecordIndex,
  );

  if (!currentDocumentDetail) {
    throw new Error(
      `Could not find docket entry with index ${docketRecordIndex}`,
    );
  }

  const multiDocketedOriginalCaseDetail = get(
    state.multiDocketedOriginalCaseDetail,
  );

  let originalDocumentDetail;

  if (multiDocketedOriginalCaseDetail) {
    const { docketEntryId } = currentDocumentDetail;
    originalDocumentDetail = multiDocketedOriginalCaseDetail.docketEntries.find(
      de => de.docketEntryId === docketEntryId,
    );

    if (!originalDocumentDetail) {
      throw new Error(
        `Could not find multiDocketed entry with docketEntryId ${docketEntryId} on case ${multiDocketedOriginalCaseDetail.docketNumber}`,
      );
    }
  } else {
    originalDocumentDetail = currentDocumentDetail;
  }

  // store.set(state.docketRecordIndex, docketRecordIndex);

  const filersMap = {};
  originalDocumentDetail.filers.forEach(filer => (filersMap[filer] = true));

  currentDocumentDetail.servedPartiesCode =
    currentDocumentDetail.servedPartiesCode ||
    applicationContext
      .getUtilities()
      .getServedPartiesCode(currentDocumentDetail.servedParties);

  const currentEditableFields = [
    'servedParties',
    'servedPartiesCode',
    'action',
    'isStricken',
  ];

  const documentDetail = {
    ...originalDocumentDetail,
    ...pick(currentDocumentDetail, currentEditableFields),
  };

  store.set(state.form, {
    ...documentDetail,
    filersMap,
    lodged: !!documentDetail.lodged,
  });

  return {
    key: 'initEventCode',
    value: documentDetail.eventCode,
  };
};
