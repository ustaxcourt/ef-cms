import { set } from 'cerebral/factories';
import { state } from 'cerebral';

export const closeDocumentCategoryAccordionSequence = [
  set(state.screenMetadata.showDocumentCategoryAccordion, false),
];
