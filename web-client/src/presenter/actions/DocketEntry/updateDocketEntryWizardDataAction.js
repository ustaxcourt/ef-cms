import { find, includes, omit, pick } from 'lodash';
import { state } from 'cerebral';

/**
 * clears data in the state.form based on which field is being updated
 *
 * @param {Object} providers the providers object
 * @param {Object} providers.get the cerebral get function
 * @param {Object} providers.store the cerebral store object
 * @param {Object} providers.props the cerebral props object
 * @returns {void}
 */
export const updateDocketEntryWizardDataAction = ({ get, store, props }) => {
  const { INTERNAL_CATEGORY_MAP } = get(state.constants);
  let entry, form;
  let supporting = get(state.screenMetadata.supporting);
  const ENTRY_PROPS = ['category', 'documentTitle', 'documentType', 'scenario'];

  switch (props.key) {
    case 'certificateOfService':
      store.unset(state.form.certificateOfServiceDate);
      store.unset(state.form.certificateOfServiceMonth);
      store.unset(state.form.certificateOfServiceDay);
      store.unset(state.form.certificateOfServiceYear);
      break;
    case 'eventCode':
      find(
        INTERNAL_CATEGORY_MAP,
        entries => (entry = find(entries, { eventCode: props.value })),
      );
      form = {
        ...omit(get(state.form), ENTRY_PROPS),
        ...pick(entry || {}, ENTRY_PROPS),
      };
      store.set(state.form, form);
      if (!supporting) {
        store.unset(state.form.previousDocument);
      }
      store.unset(state.form.serviceDate);
      store.unset(state.form.trialLocation);
      store.unset(state.form.ordinalValue);
      store.unset(state.form.freeText);
      store.unset(state.form.secondaryDocument);
      break;
    case 'secondaryDocument.eventCode':
      find(
        INTERNAL_CATEGORY_MAP,
        entries => (entry = find(entries, { eventCode: props.value })),
      );
      form = {
        ...omit(get(state.form.secondaryDocument), ENTRY_PROPS),
        ...pick(entry || {}, ENTRY_PROPS),
      };
      store.set(state.form.secondaryDocument, form);
      store.unset(state.form.secondaryDocument.previousDocument);
      store.unset(state.form.secondaryDocument.serviceDate);
      store.unset(state.form.secondaryDocument.trialLocation);
      store.unset(state.form.secondaryDocument.ordinalValue);
      store.unset(state.form.secondaryDocument.freeText);

      if (!props.value) {
        store.unset(state.form.secondaryDocument);
      }
      break;
    case 'previousDocument':
      if (supporting) {
        store.unset(state.form.exhibits);
        store.unset(state.form.attachments);
        store.unset(state.form.certificateOfService);
        store.unset(state.form.certificateOfServiceDate);
        store.unset(state.form.certificateOfServiceMonth);
        store.unset(state.form.certificateOfServiceDay);
        store.unset(state.form.certificateOfServiceYear);

        //restore previous doc data from screenMetadata onto form
        const caseDetail = get(state.caseDetail);
        const filedDocumentIds = get(state.screenMetadata.filedDocumentIds);

        const previousDocument =
          props.value &&
          find(
            caseDetail.documents,
            doc =>
              includes(filedDocumentIds, doc.documentId) &&
              (doc.documentTitle || doc.documentType) === props.value,
          );
        if (previousDocument.relationship === 'primaryDocument') {
          store.merge(state.form, get(state.screenMetadata.primary));
        } else if (previousDocument.relationship === 'secondaryDocument') {
          store.merge(state.form, get(state.screenMetadata.secondary));
        }
      }
      break;
  }
};
