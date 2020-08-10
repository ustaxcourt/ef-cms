import { state } from 'cerebral';

/**
 * sets state.hasOdsDocument if the given state.caseDetail.documents includes an ODS (DISC) file
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.get the cerebral get method
 * @param {object} providers.store the cerebral store
 * @returns {void} sets state.hasOdsDocument
 */
export const setHasOdsAction = ({ applicationContext, get, store }) => {
  const { INITIAL_DOCUMENT_TYPES } = applicationContext.getConstants();
  const caseDetail = get(state.caseDetail);

  const odsDocument = caseDetail.documents.find(
    document =>
      document.eventCode ===
      INITIAL_DOCUMENT_TYPES.ownershipDisclosure.eventCode,
  );

  store.set(state.hasOdsDocument, !!odsDocument);
};
