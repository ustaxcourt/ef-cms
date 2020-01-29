import { state } from 'cerebral';

/**
 * update state form with docket record entry and document properties
 *
 * @param {object} providers the providers object
 * @param {object} providers.props the props passed to this action
 * @param {object} providers.get the cerebral get function
 * @param {object} providers.store the cerebral store
 * @returns {void}
 */
export const setDocketEntryMetaFormForEditAction = ({ get, props, store }) => {
  const { docketRecord, documents } = get(state.caseDetail);
  const { docketRecordIndex } = props;

  const docketRecordEntry = docketRecord.find(
    ({ index }) => index == docketRecordIndex,
  );

  if (docketRecordEntry.documentId) {
    const documentDetail = documents.find(
      document => docketRecordEntry.documentId === document.documentId,
    );

    store.set(state.form, {
      ...docketRecordEntry,
      ...documentDetail,
      lodged: !!documentDetail.lodged,
    });
  } else {
    store.set(state.form, docketRecordEntry);
  }

  store.set(state.docketRecordIndex, docketRecordIndex);
};
