import { state } from '@web-client/presenter/app.cerebral';

export const setFileDocumentFormValueAction = ({
  get,
  props,
  store,
}: ActionProps) => {
  if (
    ['previousDocument', 'secondaryDocument.previousDocument'].includes(
      props.key,
    )
  ) {
    const caseDetail =
      get(state.multiDocketedOriginalCaseDetail) ?? get(state.caseDetail);

    const previousDocument = caseDetail.docketEntries.find(
      docketEntry => docketEntry.docketEntryId === props.value,
    );
    store.set(state.form[props.key], previousDocument);
  } else {
    if (props.value !== '') {
      store.set(state.form[props.key], props.value);
    } else {
      store.unset(state.form[props.key]);
    }
  }
};
