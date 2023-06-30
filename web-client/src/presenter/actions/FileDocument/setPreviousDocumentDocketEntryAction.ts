import { state } from '@web-client/presenter/app.cerebral';

/**
 * gets the DocketEntry for the previousDocument and sets it in the form
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get function
 * @param {object} providers.store the cerebral store object
 */
export const setPreviousDocumentDocketEntryAction = ({
  get,
  store,
}: ActionProps) => {
  const form = get(state.form);

  const { docketEntries } = get(state.caseDetail);
  if (form.previousDocument) {
    const previousDocumentDocketEntry = docketEntries.find(docketEntry => {
      return docketEntry.docketEntryId === form.previousDocument.docketEntryId;
    });

    if (previousDocumentDocketEntry) {
      form.previousDocument = previousDocumentDocketEntry;
      store.set(state.form, form);
    }
  }
};
