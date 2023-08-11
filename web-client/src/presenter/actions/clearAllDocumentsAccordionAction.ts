import { state } from '@web-client/presenter/app.cerebral';

/**
 * clears state.allDocumentsAccordion
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store object
 */
export const clearAllDocumentsAccordionAction = ({ store }: ActionProps) => {
  store.set(state.allDocumentsAccordion, '');
};
