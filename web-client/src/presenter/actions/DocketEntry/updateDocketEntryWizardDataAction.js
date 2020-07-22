import { find, includes, omit, pick } from 'lodash';
import { state } from 'cerebral';

/**
 * clears data in the state.form based on which field is being updated
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get function
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.store the cerebral store object
 * @returns {void}
 */
export const updateDocketEntryWizardDataAction = ({
  applicationContext,
  get,
  props,
  store,
}) => {
  const {
    DOCUMENT_RELATIONSHIPS,
    INTERNAL_CATEGORY_MAP,
  } = applicationContext.getConstants();
  let entry, form;
  let supporting = get(state.screenMetadata.supporting);
  const ENTRY_PROPS = ['category', 'documentTitle', 'documentType', 'scenario'];

  const updateBaseDocumentProps = eventCode => {
    find(
      INTERNAL_CATEGORY_MAP,
      entries => (entry = find(entries, { eventCode })),
    );
    form = {
      ...omit(get(state.form), ENTRY_PROPS),
      ...pick(entry || {}, ENTRY_PROPS),
    };
    store.set(state.form, form);
  };

  switch (props.key) {
    case 'initEventCode':
      updateBaseDocumentProps(props.value);
      break;
    case 'certificateOfService':
      store.unset(state.form.certificateOfServiceDate);
      store.unset(state.form.certificateOfServiceMonth);
      store.unset(state.form.certificateOfServiceDay);
      store.unset(state.form.certificateOfServiceYear);
      break;
    case 'eventCode':
      updateBaseDocumentProps(props.value);
      if (!supporting) {
        store.unset(state.form.previousDocument);
      } else {
        //if there is only one previously selected doc, default that selection on the form
        const filedDocumentIds = get(state.screenMetadata.filedDocumentIds);
        if (filedDocumentIds.length === 1) {
          const caseDetail = get(state.caseDetail);

          const previousDocument = find(caseDetail.documents, doc =>
            includes(filedDocumentIds, doc.documentId),
          );
          if (previousDocument) {
            store.set(state.form.previousDocument, previousDocument);

            store.merge(state.form, get(state.screenMetadata.primary));
          }
        }
      }
      store.unset(state.form.serviceDate);
      store.unset(state.form.trialLocation);
      store.unset(state.form.ordinalValue);
      store.unset(state.form.freeText);
      store.unset(state.form.secondaryDocument);
      store.unset(state.form.objections);
      store.unset(state.form.pending);
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
        if (previousDocument.relationship === DOCUMENT_RELATIONSHIPS.PRIMARY) {
          store.merge(state.form, get(state.screenMetadata.primary));
        } else if (
          previousDocument.relationship === DOCUMENT_RELATIONSHIPS.SECONDARY
        ) {
          store.merge(state.form, get(state.screenMetadata.secondary));
        }
      }
      break;
    case 'additionalInfo':
    case 'additionalInfo2':
      if (!props.value) {
        store.unset(state.form[props.key]);
      }
      break;
    case 'hasOtherFilingParty':
      store.unset(state.form.otherFilingParty);
      break;
  }
};
