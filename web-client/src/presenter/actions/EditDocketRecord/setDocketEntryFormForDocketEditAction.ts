import { cloneDeep, omit } from 'lodash';
import { state } from '@web-client/presenter/app.cerebral';

export const setDocketEntryFormForDocketEditAction = ({
  get,
  props,
  store,
}: ActionProps) => {
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

  const filersMap = {};
  docketEntryFormData.filers?.forEach(filer => (filersMap[filer] = true));

  docketEntryFormData.lodged = !!docketEntryFormData.lodged;

  docketEntryFormData.documentStorageId = docketEntry.documentStorageId;

  store.set(state.form, {
    ...docketEntryFormData,
    filersMap,
  });

  return {
    docketEntry: docketEntryFormData,
    key: 'initEventCode',
    value: docketEntryFormData.eventCode,
  };
};
