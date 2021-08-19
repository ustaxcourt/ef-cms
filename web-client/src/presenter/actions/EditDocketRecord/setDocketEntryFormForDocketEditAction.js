import { cloneDeep, omit } from 'lodash';
import { state } from 'cerebral';

/**
 * sets the current docket entry data for edit
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get method
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.store the cerebral store
 * @returns {void} sets state for docket entry edit
 */
export const setDocketEntryFormForDocketEditAction = ({
  applicationContext,
  get,
  props,
  store,
}) => {
  const caseDetail = get(state.caseDetail);
  const { docketEntryId } = props;

  const docketEntry = omit(
    caseDetail.docketEntries.find(
      entry => entry.docketEntryId === docketEntryId,
    ),
    ['workItem'],
  );

  let docketEntryFormData = cloneDeep(docketEntry);

  if (docketEntry.editState) {
    const parsedJson = JSON.parse(docketEntry.editState);
    if (parsedJson.docketNumber) {
      docketEntryFormData = JSON.parse(docketEntry.editState);
    }
  }

  if (docketEntryFormData.date) {
    const deconstructedDate = applicationContext
      .getUtilities()
      .deconstructDate(docketEntryFormData.date);
    docketEntryFormData = {
      ...docketEntryFormData,
      ...deconstructedDate,
    };
  }

  docketEntryFormData.filersMap = {};
  docketEntryFormData.filers?.forEach(
    filer => (docketEntryFormData.filersMap[filer] = true),
  );

  docketEntryFormData.lodged = !!docketEntryFormData.lodged;

  store.set(state.form, docketEntryFormData);

  return {
    docketEntry: docketEntryFormData,
    key: 'initEventCode',
    value: docketEntryFormData.eventCode,
  };
};
