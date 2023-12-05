import { find, includes, omit, pick } from 'lodash';
import { state } from '@web-client/presenter/app.cerebral';

const setDocumentPropsFromFormAndBaseDocument = ({
  applicationContext,
  eventCode,
  formProperties,
  propertyList,
}) => {
  let entry;
  const { INTERNAL_CATEGORY_MAP } = applicationContext.getConstants();

  find(
    INTERNAL_CATEGORY_MAP,
    entries => (entry = find(entries, { eventCode })),
  );

  return {
    ...omit(formProperties, propertyList),
    ...pick(entry || {}, propertyList),
  };
};

/**
 * clears data in the state.form based on which field is being updated
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
}: ActionProps) => {
  const { DOCUMENT_RELATIONSHIPS } = applicationContext.getConstants();
  let form;
  let supporting = get(state.screenMetadata.supporting);
  switch (props.key) {
    case 'initEventCode':
      form = setDocumentPropsFromFormAndBaseDocument({
        applicationContext,
        eventCode: props.value,
        formProperties: get(state.form),
        propertyList: ['category', 'documentType', 'scenario'],
      });
      store.set(state.form, form);
      break;
    case 'certificateOfService':
      store.unset(state.form.certificateOfServiceDate);
      break;
    case 'eventCode':
      form = setDocumentPropsFromFormAndBaseDocument({
        applicationContext,
        eventCode: props.value,
        formProperties: get(state.form),
        propertyList: ['category', 'documentType', 'documentTitle', 'scenario'],
      });
      store.set(state.form, form);
      if (!supporting) {
        store.unset(state.form.previousDocument);
      } else {
        //if there is only one previously selected doc, default that selection on the form
        const filedDocketEntryIds = get(
          state.screenMetadata.filedDocketEntryIds,
        );
        if (filedDocketEntryIds.length === 1) {
          const caseDetail = get(state.caseDetail);

          const previousDocument = find(caseDetail.docketEntries, doc =>
            includes(filedDocketEntryIds, doc.docketEntryId),
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
      store.unset(state.form.otherIteration);
      store.unset(state.form.freeText);
      store.unset(state.form.secondaryDocument);
      store.unset(state.form.objections);
      store.unset(state.form.pending);
      break;
    case 'secondaryDocument.eventCode':
      form = setDocumentPropsFromFormAndBaseDocument({
        applicationContext,
        eventCode: props.value,
        formProperties: get(state.form.secondaryDocument),
        propertyList: ['category', 'documentType', 'documentTitle', 'scenario'],
      });
      store.set(state.form.secondaryDocument, form);
      store.unset(state.form.secondaryDocument.previousDocument);
      store.unset(state.form.secondaryDocument.serviceDate);
      store.unset(state.form.secondaryDocument.trialLocation);
      store.unset(state.form.secondaryDocument.ordinalValue);
      store.unset(state.form.secondaryDocument.otherIteration);
      store.unset(state.form.secondaryDocument.freeText);

      if (!props.value) {
        store.unset(state.form.secondaryDocument);
      }
      break;
    case 'previousDocument':
      if (supporting) {
        store.unset(state.form.attachments);
        store.unset(state.form.certificateOfService);
        store.unset(state.form.certificateOfServiceDate);

        //restore previous doc data from screenMetadata onto form
        const caseDetail = get(state.caseDetail);
        const filedDocketEntryIds = get(
          state.screenMetadata.filedDocketEntryIds,
        );

        const previousDocument =
          props.value &&
          find(
            caseDetail.docketEntries,
            doc =>
              includes(filedDocketEntryIds, doc.docketEntryId) &&
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
