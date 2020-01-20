import { state } from 'cerebral';

/**
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get function
 * @param {object} providers.props the cerebral props function
 * @param {object} providers.store the cerebral store
 */
export const setEditDocketRecordEntryModalStateAction = ({
  get,
  props,
  store,
}) => {
  const caseDetail = get(state.caseDetail);
  const docketRecordIndex = props.index;

  const isSelectedDocketRecordEntry = docketRecord =>
    docketRecord.index === docketRecordIndex;

  const docketRecordEntry = caseDetail.docketRecord.find(
    isSelectedDocketRecordEntry,
  );

  store.set(state.modal.form, docketRecordEntry);
  store.set(state.modal.caseId, caseDetail.caseId);
  store.set(state.modal.docketRecordIndex, docketRecordIndex);
};
